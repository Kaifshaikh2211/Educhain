import { ethers } from 'ethers';
import contractConfig from '../contractConfig.json';
import studentManagementArtifact from '../artifacts/contracts/StudentManagement.sol/StudentManagement.json';

export const CONTRACT_ADDRESS = contractConfig.address;
export const CONTRACT_ABI = studentManagementArtifact.abi;

export const HARDHAT_NETWORK_PARAMS = {
  chainId: '0x7A69', // 31337 in hex
  chainName: 'Hardhat Localhost',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
};

// Check if MetaMask or any Web3 wallet is available
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
}

// Get Browser Provider from window.ethereum
export function getWeb3Provider() {
  if (isMetaMaskInstalled()) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  // Fallback to local RPC provider
  return new ethers.JsonRpcProvider(contractConfig.rpcUrl || 'http://127.0.0.1:8545');
}

// Request wallet connection
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to interact with the blockchain.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  const balanceWei = await provider.getBalance(address);
  const balanceEth = ethers.formatEther(balanceWei);

  return {
    address,
    signer,
    chainId: Number(network.chainId),
    networkName: network.name,
    balance: Number(balanceEth).toFixed(4),
  };
}

// Switch MetaMask to Hardhat Localhost network
export async function switchToHardhatNetwork() {
  if (!isMetaMaskInstalled()) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_NETWORK_PARAMS.chainId }],
    });
  } catch (switchError) {
    // If network hasn't been added to MetaMask, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [HARDHAT_NETWORK_PARAMS],
      });
    } else {
      throw switchError;
    }
  }
}

// Get Contract instance (with Signer for writes, or Provider for reads)
export async function getContract(needSigner = false) {
  const provider = getWeb3Provider();
  if (needSigner) {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is required to sign transactions.');
    }
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

// Shorten an Ethereum address for UI display
export function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Parse contract error messages nicely
export function parseContractError(error) {
  if (!error) return 'An unknown error occurred.';
  if (error.reason) return error.reason;
  if (error.data && error.data.message) return error.data.message;
  if (error.message) {
    if (error.message.includes('user rejected action')) return 'Transaction was rejected in MetaMask.';
    if (error.message.includes('Student wallet address already registered')) return 'This student wallet is already registered.';
    if (error.message.includes('Student ID already exists')) return 'This Student ID / Roll Number is already registered.';
    if (error.message.includes('Caller is not an authorized administrator')) return 'Only an authorized Administrator can perform this action.';
    if (error.message.includes('Student does not exist')) return 'No student record found with this identifier.';
    return error.message.slice(0, 160);
  }
  return String(error);
}
