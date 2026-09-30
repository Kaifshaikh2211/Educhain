import React, { useState } from 'react';
import { 
  UserCheck, 
  Award, 
  FileCheck, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  GraduationCap, 
  ExternalLink,
  Copy,
  Check,
  Download,
  Printer,
  QrCode,
  Sparkles
} from 'lucide-react';
import { shortenAddress } from '../utils/ethereum';

export default function StudentPortal({
  currentStudent,
  connectedAccount,
  allStudents,
  onSelectStudent,
  onOpenCertificateViewer,
}) {
  const [copied, setCopied] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Student Profile Overview Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Decentralized Student Identity
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Ethereum Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Student Academic Portal
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Authenticate via MetaMask to securely access and share your tamper-proof academic credentials, transcripts, and IPFS-hosted certificates.
            </p>
          </div>

          {/* Quick Student Profile Switcher for Testing / Demo */}
          <div className="w-full lg:w-auto bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1.5 uppercase font-semibold">
              Switch Student View (Sandbox / Test):
            </span>
            <select
              value={currentStudent?.studentId || ''}
              onChange={(e) => {
                const found = allStudents.find((s) => s.studentId === e.target.value);
                if (found) onSelectStudent(found);
              }}
              className="w-full lg:w-64 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {allStudents.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentId} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentStudent ? (
        <>
          {/* Official Blockchain Student ID Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ID Card Graphic */}
            <div className="lg:col-span-1 rounded-2xl glass-card p-6 border border-cyan-500/30 relative overflow-hidden flex flex-col justify-between glow-blue">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl"></div>

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-cyan-400" />
                    <span className="font-extrabold text-white text-base tracking-wide">
                      UNIVERSITY LEDGER
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-600/30 border border-cyan-400/40">
                    {currentStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {currentStudent.name}
                    </h2>
                    <p className="text-xs font-mono text-cyan-400 mt-0.5">
                      {currentStudent.studentId}
                    </p>
                    <p className="text-xs text-slate-400">
                      Class of {currentStudent.graduationYear}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Department</span>
                    <span className="font-semibold text-right max-w-[180px] truncate text-white">{currentStudent.department}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">CGPA</span>
                    <span className="font-bold text-emerald-400">{currentStudent.cgpa}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Wallet</span>
                    <span className="font-mono text-cyan-300">{shortenAddress(currentStudent.studentAddress)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setShowTranscriptModal(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Transcript
                </button>
                <span className="text-[10px] text-slate-500 font-mono">ERC-721 Ready</span>
              </div>
            </div>

            {/* Academic Detail & Credentials Feed */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Credentials / Certificates Cards */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Award className="h-5 w-5 text-cyan-400" />
                    Decentralized Academic Credentials & Degrees
                  </h3>
                  <span className="text-xs text-slate-400">
                    Stored on IPFS & Ethereum
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Primary Degree Certificate */}
                  <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 mt-1 sm:mt-0">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">
                            Official Degree Certificate & Transcript
                          </h4>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            Primary
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Major: {currentStudent.department}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-400">
                          <span>IPFS CID:</span>
                          <span className="text-cyan-300">{currentStudent.certificateIpfsHash || 'Pending upload'}</span>
                          {currentStudent.certificateIpfsHash && (
                            <button
                              onClick={() => handleCopy(currentStudent.certificateIpfsHash)}
                              className="text-slate-400 hover:text-white"
                              title="Copy CID"
                            >
                              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {currentStudent.certificateIpfsHash && (
                      <button
                        onClick={() => onOpenCertificateViewer(currentStudent.certificateIpfsHash, currentStudent.name, 'Primary Degree')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600/90 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-colors self-end sm:self-center"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Certificate
                      </button>
                    )}
                  </div>

                  {/* Additional Certificates if available */}
                  {currentStudent.certificates && currentStudent.certificates.map((cert, idx) => (
                    <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 mt-1 sm:mt-0">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{cert.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Issued: {cert.issueDate || 'Verified on-chain'}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-400">
                            <span>CID:</span>
                            <span className="text-blue-300">{cert.ipfsHash}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenCertificateViewer(cert.ipfsHash, currentStudent.name, cert.title)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600/90 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors self-end sm:self-center"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Credential
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Verification Benefits Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Why Your Academic Record is 100% Tamper Proof
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-white block mb-1">Cryptographic Proof</span>
                    No third party or database administrator can manipulate your marks or degree.
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-white block mb-1">Decentralized IPFS</span>
                    Digital certificates are preserved on decentralized nodes, eliminating single points of failure.
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-white block mb-1">Global Recruiter Trust</span>
                    Employers can verify your credentials in seconds without university bureaucratic delays.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Transcript Print Modal */}
          {showTranscriptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
              <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="font-bold text-white text-lg">Official Blockchain Transcript</h3>
                  <button onClick={() => setShowTranscriptModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="mt-6 p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <div className="text-center pb-4 border-b border-slate-800">
                    <GraduationCap className="h-10 w-10 text-cyan-400 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-white">UNIVERSITY ACADEMIC LEDGER</h2>
                    <p className="text-xs text-slate-400">Verifiable Ethereum On-Chain Academic Record</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Student Name</span>
                      <span className="font-bold text-white text-sm">{currentStudent.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Roll Number / ID</span>
                      <span className="font-bold text-cyan-400 font-mono">{currentStudent.studentId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Program / Department</span>
                      <span className="font-semibold text-slate-200">{currentStudent.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Graduation Year</span>
                      <span className="font-semibold text-slate-200">{currentStudent.graduationYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Cumulative CGPA</span>
                      <span className="font-bold text-emerald-400 text-sm">{currentStudent.cgpa} / 4.0</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Student Wallet</span>
                      <span className="font-mono text-slate-300">{shortenAddress(currentStudent.studentAddress)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">IPFS Certificate Hash</span>
                      <span className="text-xs font-mono text-cyan-400">{currentStudent.certificateIpfsHash}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <QrCode className="h-10 w-10 text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl"
                  >
                    <Printer className="h-4 w-4" />
                    Print Transcript
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center border border-slate-800">
          <UserCheck className="h-12 w-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Student Record Selected</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Please connect your registered MetaMask wallet or choose a test student from the selector above.
          </p>
        </div>
      )}

    </div>
  );
}
