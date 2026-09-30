import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Wallet, 
  UserCheck, 
  Search, 
  History, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { shortenAddress } from '../utils/ethereum';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  account, 
  balance, 
  isAdmin, 
  isStudent, 
  isConnecting, 
  onConnectWallet, 
  onDisconnectWallet, 
  onOpenMetaMaskHelp,
  isDemoMode,
  setIsDemoMode,
  networkName
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('admin')}>
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  EduChain
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Ethereum
                </span>
              </div>
              <p className="text-xs text-slate-400">Blockchain Student Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Portal
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'student'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Student Portal
              {isStudent && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('verifier')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'verifier'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Search className="h-4 w-4" />
              Public Verifier
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <History className="h-4 w-4" />
              Audit Ledger
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Live / Sandbox Mode Toggle */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              title="Toggle between Live Hardhat/Ethereum Node and Interactive Sandbox"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDemoMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              {isDemoMode ? 'Sandbox Mode' : 'Live Contract'}
            </button>

            {/* MetaMask Setup Guide Button */}
            <button
              onClick={onOpenMetaMaskHelp}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              title="MetaMask Setup & Guide"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* MetaMask Wallet Connect/Status Button */}
            {account ? (
              <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-900 border border-slate-700/80">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-mono text-xs font-semibold text-slate-200">
                      {shortenAddress(account)}
                    </span>
                  </div>
                  {balance && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {balance} ETH
                    </span>
                  )}
                </div>
                <button
                  onClick={onDisconnectWallet}
                  className="px-2.5 py-1 text-xs text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'admin' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'student' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'verifier' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Verifier
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'audit' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Ledger
          </button>
        </div>
      </div>
    </header>
  );
}
