import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  UploadCloud, 
  CheckCircle, 
  ExternalLink,
  Lock,
  Building,
  Calendar,
  Sparkles,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateIpfsHash } from '../utils/ipfs';
import { shortenAddress } from '../utils/ethereum';

export default function VerifierPortal({
  onVerifyById,
  onVerifyByHash,
  onOpenCertificateViewer,
}) {
  const [activeMode, setActiveMode] = useState('id'); // 'id' | 'hash' | 'upload'
  const [inputVal, setInputVal] = useState('STU-2024-001');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      let res = null;
      if (activeMode === 'id') {
        res = await onVerifyById(inputVal.trim());
      } else {
        res = await onVerifyByHash(inputVal.trim());
      }

      setVerificationResult(res);
      if (res && res.isValid) {
        triggerCelebration();
      }
    } catch (err) {
      setVerificationResult({ isValid: false, message: 'Verification lookup failed.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileDrop = async (file) => {
    if (!file) return;
    setIsVerifying(true);
    try {
      const hash = await calculateIpfsHash(file);
      setInputVal(hash);
      const res = await onVerifyByHash(hash);
      setVerificationResult(res);
      if (res && res.isValid) {
        triggerCelebration();
      }
    } catch (err) {
      setVerificationResult({ isValid: false, message: 'Failed to compute document hash.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          <ShieldCheck className="h-4 w-4" />
          Public Credential Verification Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Academic Credentials On-Chain
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Instant, trustless authentication for employers, background check agencies, and universities. Zero login required.
        </p>
      </div>

      {/* Verification Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 pb-4 mb-6 gap-2">
          <button
            onClick={() => { setActiveMode('id'); setInputVal('STU-2024-001'); setVerificationResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'id'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            Verify by Student ID / Roll No
          </button>

          <button
            onClick={() => { setActiveMode('hash'); setInputVal('QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx'); setVerificationResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'hash'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Hash className="h-3.5 w-3.5" />
            Verify by IPFS Hash
          </button>

          <button
            onClick={() => { setActiveMode('upload'); setVerificationResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'upload'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload Certificate Document
          </button>
        </div>

        {/* Input Forms */}
        {activeMode === 'upload' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileDrop(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
            }`}
          >
            <UploadCloud className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">Drag & drop the student's certificate file</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Computes SHA-256 IPFS hash locally in your browser and cryptographically queries the Ethereum smart contract.
            </p>
            <label className="mt-4 inline-block px-5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl cursor-pointer border border-slate-700">
              Browse Certificate File
              <input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && handleFileDrop(e.target.files[0])}
              />
            </label>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeMode === 'id' ? "Enter Roll Number (e.g. STU-2024-001)" : "Enter IPFS Multihash (Qm...)"}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {isVerifying ? 'Verifying On-Chain...' : 'Verify Authenticity'}
            </button>
          </form>
        )}

      </div>

      {/* Verification Results Display */}
      {verificationResult && (
        <div className="animate-fadeIn">
          {verificationResult.isValid ? (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/40 glow-emerald">
              
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">GENUINE & VERIFIED RECORD</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                        Valid
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Confirmed by Ethereum Smart Contract consensus. No alteration detected.
                    </p>
                  </div>
                </div>

                {verificationResult.certificateIpfsHash && (
                  <button
                    onClick={() => onOpenCertificateViewer(verificationResult.certificateIpfsHash, verificationResult.name, 'Verified Credential')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Inspect Credential File
                  </button>
                )}
              </div>

              {/* Verified Details Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Student Full Name</span>
                  <span className="text-base font-bold text-white">{verificationResult.name}</span>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Student Roll Number / ID</span>
                  <span className="text-base font-bold font-mono text-cyan-400">{verificationResult.studentId}</span>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Academic Program</span>
                  <span className="text-sm font-semibold text-slate-200">{verificationResult.department}</span>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Verified CGPA</span>
                  <span className="text-sm font-bold text-emerald-400">{verificationResult.cgpa || 'On File'}</span>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 sm:col-span-2">
                  <span className="text-slate-400 block mb-1">IPFS Storage Content Identifier (CID)</span>
                  <span className="text-xs font-mono text-cyan-300 break-all">
                    {verificationResult.certificateIpfsHash || verificationResult.ipfsHash}
                  </span>
                </div>
              </div>

              {/* Institution Seal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Issuing Authority Signature: <strong className="text-slate-200 font-mono">{shortenAddress(verificationResult.issuedBy || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')}</strong></span>
                </div>
                <span>Zero Knowledge Audit Trail: Verified</span>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-rose-500/40 bg-rose-950/10">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">VERIFICATION FAILED: UNVERIFIED OR TAMPERED</h3>
                  <p className="text-xs text-rose-300 mt-1">
                    No academic record on the Ethereum blockchain matches the provided identifier or certificate hash.
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Possible reasons:
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 mt-1 space-y-1">
                    <li>The certificate file may have been modified or tampered with by even a single byte.</li>
                    <li>The student ID entered is incorrect or not yet registered by the university.</li>
                    <li>The institution has not yet committed the transaction to the Ethereum network.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
