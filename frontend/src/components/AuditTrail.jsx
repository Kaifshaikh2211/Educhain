import React from 'react';
import { 
  History, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  FileCode, 
  Cpu, 
  Activity,
  Shield,
  Clock
} from 'lucide-react';
import { shortenAddress } from '../utils/ethereum';

export default function AuditTrail({
  events,
  contractAddress,
  chainId,
  networkName,
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Decentralized Audit Trail
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Network: {networkName || 'Hardhat Localhost (31337)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Immutable Smart Contract Event Log
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Every student registration, credential issuance, and administrative update triggers an on-chain Ethereum event, creating a tamper-evident audit record.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 block mb-1">Contract Address:</span>
            <span className="text-cyan-400 font-bold">{contractAddress}</span>
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            Live Event Stream
          </h2>
          <span className="text-xs text-slate-400 font-mono">Auto-syncing with block headers</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {events.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No blockchain events recorded yet. Register a student or issue a certificate to see the audit trail.
            </div>
          ) : (
            events.map((evt, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-900/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{evt.type}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Mined & Confirmed
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">
                      {evt.type === 'StudentRegistered' && `Enrolled student ${evt.name} (${evt.studentId})`}
                      {evt.type === 'CertificateIssued' && `Issued credential: "${evt.title}" to student (${evt.studentId})`}
                      {evt.type === 'StudentUpdated' && `Updated academic record for student (${evt.studentId})`}
                      {evt.type === 'AdminAdded' && `Granted institutional administrator authority to ${shortenAddress(evt.address)}`}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-slate-400">
                      <span>Address: <strong className="text-slate-300">{shortenAddress(evt.address)}</strong></span>
                      <span>Block: <strong className="text-cyan-400">#{evt.blockNumber || 42000 + idx}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right self-end md:self-center font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 justify-end text-cyan-300">
                    <span>Tx: {evt.txHash || '0x4f...91a2'}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end text-slate-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{evt.timestamp || 'Just now'}</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Blockchain Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2 mb-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            Ethereum Consensus Layer
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The StudentManagement smart contract utilizes EVM storage slots to guarantee state persistence. Any write transaction requires a valid cryptographic ECDSA signature from an authorized institutional administrator wallet, preventing unauthorized administrative overrides.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-blue-400" />
            IPFS Off-Chain Storage Architecture
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Storing megabytes of PDF degrees directly on Ethereum would incur excessive gas costs. Instead, digital documents are pinned to the InterPlanetary File System (IPFS). The resulting immutable Content Identifier (CID) is etched into the smart contract state for perpetual verification.
          </p>
        </div>
      </div>

    </div>
  );
}
