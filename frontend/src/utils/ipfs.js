/**
 * IPFS decentralized storage utility
 * Supports:
 * 1. Cryptographic SHA-256 IPFS Content Identifier (CID) hashing
 * 2. Pinata API Gateway integration (if configured)
 * 3. Local browser decentralized blob cache so uploaded certificates are viewable anytime
 */

// Simple Base58 encoder for IPFS Qm... style multihash
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function toBase58(bytes) {
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
    digits[0] += bytes[i];
    let carry = 0;
    for (let j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) digits.push(0);
  return digits.reverse().map(digit => BASE58_ALPHABET[digit]).join('');
}

/**
 * Calculates a standard IPFS v0 CID multihash (starts with Qm...)
 * Hash function: SHA-256 (0x12), length 32 (0x20)
 */
export async function calculateIpfsHash(fileOrBlob) {
  const arrayBuffer = await fileOrBlob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = new Uint8Array(hashBuffer);

  // Multihash prefix: 0x12 (SHA-256), 0x20 (32 bytes length)
  const multihash = new Uint8Array(2 + hashArray.length);
  multihash[0] = 0x12;
  multihash[1] = 0x20;
  multihash.set(hashArray, 2);

  return toBase58(multihash);
}

/**
 * Upload certificate to IPFS
 * If Pinata credentials exist in localStorage, posts directly to Pinata.
 * Otherwise, generates a real cryptographic IPFS CID and caches the blob locally.
 */
export async function uploadToIpfs(file, customTitle = '') {
  const ipfsHash = await calculateIpfsHash(file);

  // Check if Pinata JWT is configured in settings
  const pinataJwt = localStorage.getItem('pinata_jwt');

  if (pinataJwt) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: customTitle || file.name,
      });
      formData.append('pinataMetadata', metadata);

      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          ipfsHash: data.IpfsHash || ipfsHash,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash || ipfsHash}`,
          size: file.size,
          name: file.name,
          mimeType: file.type,
          isPinnedToPinata: true,
        };
      }
    } catch (err) {
      console.warn('Pinata upload failed, falling back to local IPFS cache:', err);
    }
  }

  // Local caching so preview works offline / without cloud API keys
  try {
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    const dataUrl = await dataUrlPromise;
    localStorage.setItem(`ipfs_${ipfsHash}`, JSON.stringify({
      dataUrl,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.warn('Could not cache file dataUrl in localStorage (might exceed storage limit):', e);
  }

  return {
    ipfsHash,
    gatewayUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
    size: file.size,
    name: file.name,
    mimeType: file.type,
    isPinnedToPinata: false,
  };
}

/**
 * Retrieve cached or gateway URL for an IPFS hash
 */
export function getIpfsFile(ipfsHash) {
  const cached = localStorage.getItem(`ipfs_${ipfsHash}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
  return null;
}

export function formatIpfsGatewayUrl(ipfsHash) {
  if (!ipfsHash) return '';
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}
