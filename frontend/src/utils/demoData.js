export const INITIAL_DEMO_STUDENTS = [
  {
    studentAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    studentId: "STU-2024-001",
    name: "Alex Rivera",
    department: "Computer Science & Engineering",
    email: "alex.rivera@university.edu",
    cgpa: "3.92",
    graduationYear: 2024,
    certificateIpfsHash: "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    isRegistered: true,
    registrationTimestamp: 1716300000,
    lastUpdatedTimestamp: 1716300000,
    certificates: [
      {
        title: "Bachelor of Science in Computer Science",
        ipfsHash: "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
        issueDate: "May 2024",
        timestamp: 1716300000,
        issuedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      },
      {
        title: "Dean's Honor List Distinction",
        ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        issueDate: "December 2023",
        timestamp: 1702400000,
        issuedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      }
    ]
  },
  {
    studentAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    studentId: "STU-2025-042",
    name: "Priya Sharma",
    department: "Artificial Intelligence & Data Science",
    email: "priya.sharma@university.edu",
    cgpa: "3.88",
    graduationYear: 2025,
    certificateIpfsHash: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB",
    isRegistered: true,
    registrationTimestamp: 1721500000,
    lastUpdatedTimestamp: 1721500000,
    certificates: [
      {
        title: "Major Capstone Project Credential",
        ipfsHash: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB",
        issueDate: "July 2024",
        timestamp: 1721500000,
        issuedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      }
    ]
  },
  {
    studentAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    studentId: "STU-2026-108",
    name: "Marcus Vance",
    department: "Cybersecurity & Blockchain Systems",
    email: "marcus.vance@university.edu",
    cgpa: "3.75",
    graduationYear: 2026,
    certificateIpfsHash: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
    isRegistered: true,
    registrationTimestamp: 1727000000,
    lastUpdatedTimestamp: 1727000000,
    certificates: [
      {
        title: "Smart Contract Security Audit Excellence",
        ipfsHash: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
        issueDate: "September 2024",
        timestamp: 1727000000,
        issuedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      }
    ]
  }
];

export const INITIAL_DEMO_EVENTS = [
  {
    type: "StudentRegistered",
    studentId: "STU-2026-108",
    name: "Marcus Vance",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    txHash: "0x892a...c4e1",
    blockNumber: 42109,
    timestamp: "2 hours ago"
  },
  {
    type: "CertificateIssued",
    studentId: "STU-2025-042",
    title: "Major Capstone Project Credential",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    txHash: "0x37ab...5512",
    blockNumber: 42085,
    timestamp: "1 day ago"
  },
  {
    type: "StudentRegistered",
    studentId: "STU-2024-001",
    name: "Alex Rivera",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    txHash: "0x12fa...77ae",
    blockNumber: 41920,
    timestamp: "3 days ago"
  }
];
