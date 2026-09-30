import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Shield, 
  PlusCircle, 
  Search, 
  Filter, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Edit3,
  UserPlus,
  RefreshCw,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';
import { shortenAddress } from '../utils/ethereum';
import { uploadToIpfs } from '../utils/ipfs';

export default function AdminPortal({
  students,
  stats,
  account,
  isAdmin,
  onRegisterStudent,
  onUpdateStudent,
  onAddCertificate,
  onAddAdmin,
  onSelectStudentView,
  onOpenCertificateViewer,
  isLoading,
  contractAddress,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState(null); // student object or null
  const [showUpdateModal, setShowUpdateModal] = useState(null); // student object or null
  const [showAdminMgmt, setShowAdminMgmt] = useState(false);
  const [newAdminAddr, setNewAdminAddr] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    studentAddress: '',
    studentId: '',
    name: '',
    department: 'Computer Science & Engineering',
    email: '',
    cgpa: '3.8',
    graduationYear: 2026,
    certificateIpfsHash: '',
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isHashingFile, setIsHashingFile] = useState(false);

  // Issue Certificate Form State
  const [certForm, setCertForm] = useState({
    title: 'Semester Grade Card & Academic Marksheet',
    issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    ipfsHash: '',
  });
  const [certUploadedFile, setCertUploadedFile] = useState(null);

  // Update Student Form State
  const [updateForm, setUpdateForm] = useState({
    name: '',
    department: '',
    email: '',
    cgpa: '',
    graduationYear: '',
    certificateIpfsHash: '',
  });

  const departments = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Cybersecurity & Blockchain Systems',
    'Electronics & Communication Engineering',
    'Mechanical & Aerospace Engineering',
    'Civil & Infrastructure Engineering',
    'Biotechnology & Bioinformatics',
    'Business & Technology Management'
  ];

  // Handle Drag & Drop File Upload for Register
  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsHashingFile(true);
      setUploadedFile(file);
      const result = await uploadToIpfs(file, `${regForm.studentId || 'STUDENT'}_Certificate`);
      setRegForm((prev) => ({
        ...prev,
        certificateIpfsHash: result.ipfsHash,
      }));
    } catch (err) {
      console.error('File upload error:', err);
      alert('Failed to process certificate file.');
    } finally {
      setIsHashingFile(false);
    }
  };

  // Handle Certificate Upload for additional cert modal
  const handleCertFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsHashingFile(true);
      setCertUploadedFile(file);
      const result = await uploadToIpfs(file, certForm.title);
      setCertForm((prev) => ({
        ...prev,
        ipfsHash: result.ipfsHash,
      }));
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsHashingFile(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.studentAddress || !regForm.studentId || !regForm.name) {
      alert('Please fill in all required fields (Address, Student ID, Name)');
      return;
    }
    const success = await onRegisterStudent(regForm);
    if (success) {
      setShowRegisterModal(false);
      setRegForm({
        studentAddress: '',
        studentId: '',
        name: '',
        department: departments[0],
        email: '',
        cgpa: '3.8',
        graduationYear: 2026,
        certificateIpfsHash: '',
      });
      setUploadedFile(null);
    }
  };

  const handleIssueCertSubmit = async (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.ipfsHash) {
      alert('Please provide a certificate title and IPFS document.');
      return;
    }
    const success = await onAddCertificate(
      showIssueCertModal.studentAddress,
      certForm.title,
      certForm.ipfsHash,
      certForm.issueDate
    );
    if (success) {
      setShowIssueCertModal(null);
      setCertForm({
        title: 'Semester Grade Card & Academic Marksheet',
        issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        ipfsHash: '',
      });
      setCertUploadedFile(null);
    }
  };

  const openUpdateModal = (student) => {
    setShowUpdateModal(student);
    setUpdateForm({
      name: student.name,
      department: student.department,
      email: student.email,
      cgpa: student.cgpa,
      graduationYear: student.graduationYear,
      certificateIpfsHash: student.certificateIpfsHash,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdateStudent(showUpdateModal.studentAddress, updateForm);
    if (success) {
      setShowUpdateModal(null);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner / Welcome */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Institutional Authority
              </span>
              {isAdmin ? (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3" />
                  Admin Authorized
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <AlertCircle className="h-3 w-3" />
                  Viewer Mode (Connect Admin Wallet for writes)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Registry & Credential Management
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Immutably register student academic identities, issue cryptographically verifiable degrees with IPFS storage, and maintain transparent auditability on Ethereum.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAdminMgmt(!showAdminMgmt)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Shield className="h-4 w-4 text-cyan-400" />
              Manage Admins
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Register Student
            </button>
          </div>
        </div>
      </div>

      {/* Admin Management Accordion */}
      {showAdminMgmt && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              Institutional Admin Delegation
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Contract: {shortenAddress(contractAddress)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Authorized admins can register students, update academic records, and issue verifiable degree certificates.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newAdminAddr) {
                onAddAdmin(newAdminAddr);
                setNewAdminAddr('');
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Enter Ethereum wallet address (0x...)"
              value={newAdminAddr}
              onChange={(e) => setNewAdminAddr(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !newAdminAddr}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors"
            >
              Grant Admin Rights
            </button>
          </form>
        </div>
      )}

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats.totalStudents || students.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">On-chain verified</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Issued Credentials
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats.totalCertificates || 3}
            </span>
            <span className="text-xs text-cyan-400 font-medium">Stored on IPFS</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              University Admins
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats.totalAdmins || 1}
            </span>
            <span className="text-xs text-slate-400 font-medium">Multi-signatory</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ledger Consensus
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Tamper Proof
            </span>
            <span className="text-xs text-slate-400 font-mono">100% Finality</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-4 justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, Name, or Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Department Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full md:w-64 px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Records Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-base">Registered Academic Records</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              {filteredStudents.length} entries
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Powered by Solidity & IPFS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Roll No / ID</th>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">CGPA</th>
                <th className="py-3.5 px-6">Wallet Address</th>
                <th className="py-3.5 px-6">Certificate (IPFS)</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No student records match your search query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-cyan-400">
                      {student.studentId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{student.name}</div>
                      <div className="text-xs text-slate-400">{student.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block max-w-[200px] truncate text-slate-300" title={student.department}>
                        {student.department}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {student.cgpa}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      {shortenAddress(student.studentAddress)}
                    </td>
                    <td className="py-4 px-6">
                      {student.certificateIpfsHash ? (
                        <button
                          onClick={() => onOpenCertificateViewer(student.certificateIpfsHash, student.name, 'Primary Degree')}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-colors"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          {student.certificateIpfsHash.slice(0, 8)}...
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">None attached</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectStudentView(student)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Official Student ID"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowIssueCertModal(student)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
                          title="Issue Additional Certificate"
                        >
                          <Award className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openUpdateModal(student)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Update Student Info"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: REGISTER NEW STUDENT */}
      {/* ======================================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-cyan-400" />
                  Register Student on Blockchain
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Creates an immutable smart contract record and assigns certificate hash
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Student Wallet Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={regForm.studentAddress}
                    onChange={(e) => setRegForm({ ...regForm, studentAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  {account && (
                    <button
                      type="button"
                      onClick={() => setRegForm({ ...regForm, studentAddress: account })}
                      className="text-[11px] text-cyan-400 hover:underline mt-1 inline-block"
                    >
                      Use connected wallet ({shortenAddress(account)})
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Roll Number / Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-2026-789"
                    value={regForm.studentId}
                    onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaif Siddiqui"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Department / Academic Program
                  </label>
                  <select
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Cumulative CGPA / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.9"
                    value={regForm.cgpa}
                    onChange={(e) => setRegForm({ ...regForm, cgpa: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2035"
                    value={regForm.graduationYear}
                    onChange={(e) => setRegForm({ ...regForm, graduationYear: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* IPFS Certificate Upload Area */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Upload Degree Certificate / Marksheet to IPFS
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-5 text-center transition-all bg-slate-900/40">
                  <UploadCloud className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">
                    Drag and drop student credential PDF/Image, or click to browse
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Generates cryptographic SHA-256 IPFS CID. File is decentralized, only hash stored on-chain.
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="reg-file-upload"
                  />
                  <label
                    htmlFor="reg-file-upload"
                    className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer transition-colors"
                  >
                    Select File
                  </label>

                  {uploadedFile && (
                    <div className="mt-3 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium truncate max-w-xs">{uploadedFile.name}</span>
                        <span className="text-cyan-400 font-mono">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300 mt-1 truncate">
                        CID: {regForm.certificateIpfsHash}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 text-sm rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isHashingFile}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {isLoading ? 'Confirming on Ethereum...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ISSUE ADDITIONAL CERTIFICATE */}
      {/* ======================================================== */}
      {showIssueCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" />
                Issue Credential: {showIssueCertModal.name}
              </h3>
              <button onClick={() => setShowIssueCertModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleIssueCertSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Credential / Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. Master's Degree / Merit Certificate"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Issue Date
                </label>
                <input
                  type="text"
                  value={certForm.issueDate}
                  onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Upload Document to IPFS
                </label>
                <input
                  type="file"
                  onChange={(e) => handleCertFileUpload(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700"
                />
                {certForm.ipfsHash && (
                  <p className="mt-2 text-xs font-mono text-cyan-300 truncate">
                    IPFS CID: {certForm.ipfsHash}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowIssueCertModal(null)}
                  className="px-4 py-2 text-sm text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !certForm.ipfsHash}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                >
                  Issue to Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: UPDATE STUDENT INFO */}
      {/* ======================================================== */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-cyan-400" />
                Update Student: {showUpdateModal.studentId}
              </h3>
              <button onClick={() => setShowUpdateModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Department
                </label>
                <select
                  value={updateForm.department}
                  onChange={(e) => setUpdateForm({ ...updateForm, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    CGPA
                  </label>
                  <input
                    type="text"
                    value={updateForm.cgpa}
                    onChange={(e) => setUpdateForm({ ...updateForm, cgpa: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={updateForm.graduationYear}
                    onChange={(e) => setUpdateForm({ ...updateForm, graduationYear: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(null)}
                  className="px-4 py-2 text-sm text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                >
                  Save to Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
