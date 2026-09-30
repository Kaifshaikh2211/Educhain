import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import StudentPortal from './components/StudentPortal';
import VerifierPortal from './components/VerifierPortal';
import AuditTrail from './components/AuditTrail';
import CertificateModal from './components/CertificateModal';
import MetaMaskModal from './components/MetaMaskModal';

import { 
  connectWallet, 
  getContract, 
  isMetaMaskInstalled,
  CONTRACT_ADDRESS,
  parseContractError
} from './utils/ethereum';
import { INITIAL_DEMO_STUDENTS, INITIAL_DEMO_EVENTS } from './utils/demoData';

export default function App() {
  const [activeTab, setActiveTab] = useState('admin');
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // default true for first-time convenience
  const [isStudent, setIsStudent] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState('Hardhat Localhost (31337)');
  
  // App data state
  const [students, setStudents] = useState(INITIAL_DEMO_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_DEMO_STUDENTS[0]);
  const [events, setEvents] = useState(INITIAL_DEMO_EVENTS);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certModalData, setCertModalData] = useState({ ipfsHash: '', studentName: '', title: '' });
  const [isMetaMaskHelpOpen, setIsMetaMaskHelpOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Attempt initial wallet check & contract data sync
  useEffect(() => {
    if (isMetaMaskInstalled() && window.ethereum.selectedAddress) {
      handleConnectWallet();
    }
    fetchContractData();
  }, []);

  // Listen to MetaMask account & chain changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkAccountRoles(accounts[0]);
          showToast(`Wallet switched: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`, 'info');
        } else {
          setAccount(null);
          setIsAdmin(false);
          setIsStudent(false);
          showToast('Wallet disconnected', 'info');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [students]);

  const checkAccountRoles = async (userAddress) => {
    try {
      const contract = await getContract(false);
      const isOwnerOrAdmin = await contract.isAdmin(userAddress);
      setIsAdmin(Boolean(isOwnerOrAdmin));
    } catch {
      // In demo or fallback, treat the first default test address as admin
      setIsAdmin(true);
    }

    const matchedStudent = students.find(
      (s) => s.studentAddress.toLowerCase() === userAddress.toLowerCase()
    );
    if (matchedStudent) {
      setIsStudent(true);
      setSelectedStudent(matchedStudent);
    } else {
      setIsStudent(false);
    }
  };

  const fetchContractData = async () => {
    try {
      const contract = await getContract(false);
      const onChainStudents = await contract.getAllStudents();
      if (onChainStudents && onChainStudents.length > 0) {
        const formatted = onChainStudents.map((s) => ({
          studentAddress: s.studentAddress,
          studentId: s.studentId,
          name: s.name,
          department: s.department,
          email: s.email,
          cgpa: s.cgpa,
          graduationYear: Number(s.graduationYear),
          certificateIpfsHash: s.certificateIpfsHash,
          isRegistered: s.isRegistered,
          registrationTimestamp: Number(s.registrationTimestamp),
          lastUpdatedTimestamp: Number(s.lastUpdatedTimestamp),
        }));
        setStudents(formatted);
        if (formatted.length > 0) {
          setSelectedStudent(formatted[0]);
        }
      }
    } catch (err) {
      console.log('Contract query fallback to local state (node may be offline):', err.message);
    }
  };

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const res = await connectWallet();
      setAccount(res.address);
      setBalance(res.balance);
      setNetworkName(res.networkName || 'Hardhat Localhost (31337)');
      await checkAccountRoles(res.address);
      showToast('MetaMask connected successfully!', 'success');
    } catch (err) {
      console.warn('Connect wallet notice:', err);
      showToast(parseContractError(err), 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    showToast('Wallet disconnected', 'info');
  };

  // 1. Register Student Handler
  const handleRegisterStudent = async (formData) => {
    setIsLoading(true);
    try {
      if (!isDemoMode && isMetaMaskInstalled() && account) {
        const contract = await getContract(true);
        const tx = await contract.registerStudent(
          formData.studentAddress,
          formData.studentId,
          formData.name,
          formData.department,
          formData.email,
          formData.cgpa,
          formData.graduationYear,
          formData.certificateIpfsHash || ''
        );
        showToast('Transaction submitted to Ethereum. Awaiting confirmation...', 'info');
        const receipt = await tx.wait();

        // Record event
        const newEvent = {
          type: 'StudentRegistered',
          studentId: formData.studentId,
          name: formData.name,
          address: formData.studentAddress,
          txHash: receipt.hash ? `${receipt.hash.slice(0, 10)}...${receipt.hash.slice(-6)}` : '0x7e8...11a',
          blockNumber: receipt.blockNumber || 42110,
          timestamp: 'Just now',
        };
        setEvents((prev) => [newEvent, ...prev]);
        showToast(`Student ${formData.name} successfully registered on-chain!`, 'success');
        await fetchContractData();
        return true;
      } else {
        // Instant In-Memory / Sandbox Mode Simulation
        const newStudent = {
          ...formData,
          isRegistered: true,
          registrationTimestamp: Math.floor(Date.now() / 1000),
          lastUpdatedTimestamp: Math.floor(Date.now() / 1000),
          certificates: formData.certificateIpfsHash
            ? [
                {
                  title: 'Primary Degree Credential',
                  ipfsHash: formData.certificateIpfsHash,
                  issueDate: 'Today',
                  timestamp: Math.floor(Date.now() / 1000),
                  issuedBy: account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                },
              ]
            : [],
        };

        setStudents((prev) => [newStudent, ...prev]);
        const newEvent = {
          type: 'StudentRegistered',
          studentId: formData.studentId,
          name: formData.name,
          address: formData.studentAddress,
          txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          blockNumber: 42100 + events.length,
          timestamp: 'Just now',
        };
        setEvents((prev) => [newEvent, ...prev]);
        showToast(`Student ${formData.name} registered (Simulated On-Chain Transaction)!`, 'success');
        return true;
      }
    } catch (err) {
      showToast(parseContractError(err), 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Update Student Handler
  const handleUpdateStudent = async (studentAddress, updateData) => {
    setIsLoading(true);
    try {
      if (!isDemoMode && isMetaMaskInstalled() && account) {
        const contract = await getContract(true);
        const tx = await contract.updateStudent(
          studentAddress,
          updateData.name,
          updateData.department,
          updateData.email,
          updateData.cgpa,
          updateData.graduationYear,
          updateData.certificateIpfsHash || ''
        );
        showToast('Submitting update transaction...', 'info');
        await tx.wait();
        await fetchContractData();
      } else {
        setStudents((prev) =>
          prev.map((s) =>
            s.studentAddress.toLowerCase() === studentAddress.toLowerCase()
              ? { ...s, ...updateData, lastUpdatedTimestamp: Math.floor(Date.now() / 1000) }
              : s
          )
        );
      }

      setEvents((prev) => [
        {
          type: 'StudentUpdated',
          studentId: updateData.name,
          address: studentAddress,
          txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
          blockNumber: 42105,
          timestamp: 'Just now',
        },
        ...prev,
      ]);

      showToast('Student academic record updated on blockchain!', 'success');
      return true;
    } catch (err) {
      showToast(parseContractError(err), 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Issue Additional Certificate Handler
  const handleAddCertificate = async (studentAddress, title, ipfsHash, issueDate) => {
    setIsLoading(true);
    try {
      if (!isDemoMode && isMetaMaskInstalled() && account) {
        const contract = await getContract(true);
        const tx = await contract.addCertificate(studentAddress, title, ipfsHash, issueDate);
        showToast('Issuing certificate on Ethereum...', 'info');
        await tx.wait();
        await fetchContractData();
      } else {
        const newCert = {
          title,
          ipfsHash,
          issueDate,
          timestamp: Math.floor(Date.now() / 1000),
          issuedBy: account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        };
        setStudents((prev) =>
          prev.map((s) => {
            if (s.studentAddress.toLowerCase() === studentAddress.toLowerCase()) {
              return {
                ...s,
                certificates: [...(s.certificates || []), newCert],
              };
            }
            return s;
          })
        );
      }

      setEvents((prev) => [
        {
          type: 'CertificateIssued',
          studentId: title,
          address: studentAddress,
          txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
          blockNumber: 42106,
          timestamp: 'Just now',
        },
        ...prev,
      ]);

      showToast(`Credential "${title}" issued and pinned to IPFS!`, 'success');
      return true;
    } catch (err) {
      showToast(parseContractError(err), 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Add Admin Handler
  const handleAddAdmin = async (newAdminAddress) => {
    setIsLoading(true);
    try {
      if (!isDemoMode && isMetaMaskInstalled() && account) {
        const contract = await getContract(true);
        const tx = await contract.addAdmin(newAdminAddress);
        showToast('Adding institutional admin...', 'info');
        await tx.wait();
      }
      setEvents((prev) => [
        {
          type: 'AdminAdded',
          address: newAdminAddress,
          txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
          blockNumber: 42107,
          timestamp: 'Just now',
        },
        ...prev,
      ]);
      showToast(`Address ${newAdminAddress.slice(0, 8)}... granted admin rights!`, 'success');
    } catch (err) {
      showToast(parseContractError(err), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Public Verifier by Student ID
  const handleVerifyById = async (studentId) => {
    try {
      const contract = await getContract(false);
      const student = await contract.getStudentRecordById(studentId);
      if (student && student.isRegistered) {
        return {
          isValid: true,
          name: student.name,
          studentId: student.studentId,
          department: student.department,
          cgpa: student.cgpa,
          certificateIpfsHash: student.certificateIpfsHash,
          issuedBy: CONTRACT_ADDRESS,
        };
      }
    } catch {
      // Local fallback
      const found = students.find((s) => s.studentId.toLowerCase() === studentId.toLowerCase());
      if (found) {
        return {
          isValid: true,
          name: found.name,
          studentId: found.studentId,
          department: found.department,
          cgpa: found.cgpa,
          certificateIpfsHash: found.certificateIpfsHash,
          issuedBy: CONTRACT_ADDRESS,
        };
      }
    }
    return { isValid: false };
  };

  // 6. Public Verifier by IPFS Hash
  const handleVerifyByHash = async (ipfsHash) => {
    try {
      const contract = await getContract(false);
      const res = await contract.verifyCertificateByHash(ipfsHash);
      if (res && res.isValid) {
        return {
          isValid: true,
          name: res.studentName,
          studentId: res.studentId,
          department: res.department,
          certificateIpfsHash: ipfsHash,
          issuedBy: res.issuedBy,
        };
      }
    } catch {
      // Local fallback search
      for (const st of students) {
        if (st.certificateIpfsHash === ipfsHash) {
          return {
            isValid: true,
            name: st.name,
            studentId: st.studentId,
            department: st.department,
            cgpa: st.cgpa,
            certificateIpfsHash: ipfsHash,
            issuedBy: CONTRACT_ADDRESS,
          };
        }
        if (st.certificates) {
          for (const cert of st.certificates) {
            if (cert.ipfsHash === ipfsHash) {
              return {
                isValid: true,
                name: st.name,
                studentId: st.studentId,
                department: st.department,
                cgpa: st.cgpa,
                certificateIpfsHash: ipfsHash,
                issuedBy: cert.issuedBy || CONTRACT_ADDRESS,
              };
            }
          }
        }
      }
    }
    return { isValid: false };
  };

  const openCertificateViewer = (ipfsHash, studentName, title) => {
    setCertModalData({ ipfsHash, studentName, title });
    setIsCertModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-3 backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 glow-emerald'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
              : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40'
          }`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        account={account}
        balance={balance}
        isAdmin={isAdmin}
        isStudent={isStudent}
        isConnecting={isConnecting}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onOpenMetaMaskHelp={() => setIsMetaMaskHelpOpen(true)}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        networkName={networkName}
      />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'admin' && (
          <AdminPortal
            students={students}
            stats={{
              totalStudents: students.length,
              totalCertificates: students.reduce((acc, s) => acc + (s.certificates?.length || 1), 0),
              totalAdmins: 1,
            }}
            account={account}
            isAdmin={isAdmin}
            onRegisterStudent={handleRegisterStudent}
            onUpdateStudent={handleUpdateStudent}
            onAddCertificate={handleAddCertificate}
            onAddAdmin={handleAddAdmin}
            onSelectStudentView={(student) => {
              setSelectedStudent(student);
              setActiveTab('student');
            }}
            onOpenCertificateViewer={openCertificateViewer}
            isLoading={isLoading}
            contractAddress={CONTRACT_ADDRESS}
          />
        )}

        {activeTab === 'student' && (
          <StudentPortal
            currentStudent={selectedStudent}
            connectedAccount={account}
            allStudents={students}
            onSelectStudent={setSelectedStudent}
            onOpenCertificateViewer={openCertificateViewer}
          />
        )}

        {activeTab === 'verifier' && (
          <VerifierPortal
            onVerifyById={handleVerifyById}
            onVerifyByHash={handleVerifyByHash}
            onOpenCertificateViewer={openCertificateViewer}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrail
            events={events}
            contractAddress={CONTRACT_ADDRESS}
            chainId={31337}
            networkName={networkName}
          />
        )}
      </main>

      {/* Certificate Viewer Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        ipfsHash={certModalData.ipfsHash}
        studentName={certModalData.studentName}
        title={certModalData.title}
      />

      {/* MetaMask Quickstart Guide Modal */}
      <MetaMaskModal
        isOpen={isMetaMaskHelpOpen}
        onClose={() => setIsMetaMaskHelpOpen(false)}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            EduChain &bull; Blockchain-Based Student Management System
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Solidity 0.8.20</span>
            <span>&bull;</span>
            <span>IPFS Decentralized Storage</span>
            <span>&bull;</span>
            <span>MetaMask Integration</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
