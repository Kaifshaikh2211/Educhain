import React from 'react';
import { 
  Award, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  GraduationCap,
  Copy,
  Printer
} from 'lucide-react';
import { getIpfsFile, formatIpfsGatewayUrl } from '../utils/ipfs';

export default function CertificateModal({
  isOpen,
  onClose,
  ipfsHash,
  studentName,
  title,
}) {
  if (!isOpen) return null;

  const cachedFile = ipfsHash ? getIpfsFile(ipfsHash) : null;
  const isImage = cachedFile?.mimeType?.startsWith('image/');
  const isPdf = cachedFile?.mimeType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Verifiable Academic Credential</h3>
              <p className="text-xs text-slate-400">Decentralized IPFS Storage Proof</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Certificate Display Area */}
        <div className="mt-6">
          {cachedFile?.dataUrl && isImage ? (
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/60 p-2">
              <img
                src={cachedFile.dataUrl}
                alt={title || 'Certificate'}
                className="w-full max-h-[500px] object-contain rounded-xl"
              />
            </div>
          ) : (
            /* Digital Diploma Certificate Canvas */
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-cyan-500/40 relative shadow-2xl text-center space-y-6">
              
              {/* Crest & Seal */}
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-cyan-950/80 border-2 border-cyan-400 text-cyan-400 shadow-xl shadow-cyan-500/20">
                <GraduationCap className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                  OFFICIAL INSTITUTIONAL DEGREE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                  Certificate of Academic Achievement
                </h2>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                This certifies that the recipient has satisfactorily completed the prescribed curriculum and is awarded this verifiable credential recorded on the Ethereum blockchain.
              </p>

              <div className="py-4 border-y border-slate-800/80">
                <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block mb-1">
                  Proudly Conferred Upon
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent">
                  {studentName || 'Student Name'}
                </h1>
                <p className="text-sm font-semibold text-slate-300 mt-2">
                  {title || 'Degree of Excellence'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 gap-4">
                <div className="text-left font-mono">
                  <span className="text-slate-500 block text-[10px]">ETHEREUM CONSENSUS</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Cryptographically Tamper-Proof
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-slate-500 block text-[10px]">STORAGE ARCHITECTURE</span>
                  <span className="text-cyan-400 font-bold">InterPlanetary File System (IPFS)</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* IPFS CID Details */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 overflow-hidden">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              IPFS Content Identifier (CID Multihash)
            </span>
            <span className="text-xs font-mono text-cyan-300 break-all select-all">
              {ipfsHash || 'Qm...'}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <a
              href={formatIpfsGatewayUrl(ipfsHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              IPFS Gateway
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
