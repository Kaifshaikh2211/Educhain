import React, { useState } from 'react';
import { 
  Wallet, 
  HelpCircle, 
  Check, 
  Copy, 
  ExternalLink, 
  AlertCircle,
  Key,
  Shield,
  Layers,
  Terminal
} from 'lucide-react';
import { switchToHardhatNetwork } from '../utils/ethereum';

export default function MetaMaskModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const testAccounts = [
    {
      role: "Institution Owner / Admin #1",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      balance: "10,000 ETH"
    },
    {
      role: "College Registrar / Admin #2",
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
      balance: "10,000 ETH"
    },
    {
      role: "Student Account (Alex Rivera)",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
      balance: "10,000 ETH"
    }
  ];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">MetaMask & Web3 Quickstart Guide</h3>
              <p className="text-xs text-slate-400">Configure your digital wallet for Ethereum smart contracts</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-6 text-sm text-slate-300">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono">1</span>
                Connect to Hardhat Localhost Network
              </h4>
              <button
                onClick={switchToHardhatNetwork}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                Auto-Switch Network
              </button>
            </div>
            <p className="text-xs text-slate-400">
              In MetaMask, click Settings &rarr; Networks &rarr; Add a network manually:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-slate-950 rounded-xl text-slate-300">
              <div>Network Name: <strong className="text-white">Hardhat Local</strong></div>
              <div>RPC URL: <strong className="text-cyan-400">http://127.0.0.1:8545</strong></div>
              <div>Chain ID: <strong className="text-cyan-400">31337</strong></div>
              <div>Currency Symbol: <strong className="text-white">ETH</strong></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">2</span>
              Import Free Test Accounts with 10,000 ETH
            </h4>
            <p className="text-xs text-slate-400">
              Import one of Hardhat's default test private keys into MetaMask for instant, zero-cost transactions:
            </p>

            <div className="space-y-2.5">
              {testAccounts.map((acc, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{acc.role}</span>
                    <span className="font-mono text-emerald-400 text-[11px]">{acc.balance}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Address: {acc.address}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                      Key: {acc.privateKey}
                    </span>
                    <button
                      onClick={() => handleCopy(acc.privateKey, `key-${i}`)}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      {copiedKey === `key-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      Copy Key
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-300">
            <p className="flex items-center gap-2 font-semibold">
              <Terminal className="h-4 w-4 shrink-0" />
              Running the Local Node:
            </p>
            <p className="text-slate-300 mt-1">
              Run <code className="px-1.5 py-0.5 bg-slate-900 rounded font-mono text-white">npx hardhat node</code> in your project terminal to start the local Ethereum network whenever you want to process live blockchain blocks.
            </p>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
