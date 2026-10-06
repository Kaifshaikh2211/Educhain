# The Blockchain-Based Student Management System

> Abstract : The Blockchain-Based Student Management System is a secure, transparent, and decentralized platform designed to efficiently manage and store student academic records using blockchain technology. Traditional student data management systems are often centralized, making them vulnerable to data tampering, unauthorized access, and lack of transparency. This project addresses these challenges by leveraging the Ethereum blockchain to ensure data integrity, security, and trust.
The system allows administrators (such as colleges or institutions) to add, update, and manage student records, while students can securely access their own academic information. Smart contracts written in Solidity are used to automate and enforce rules for data storage and access. To enhance usability, the platform integrates MetaMask, enabling users to authenticate and interact with the blockchain through their digital wallets.
Additionally, large files such as certificates can be stored using decentralized storage solutions like IPFS, with only their hash stored on the blockchain for verification. The frontend is built using React.js, providing an interactive and user-friendly interface for both administrators and students.
Overall, this system ensures tamper-proof record keeping, improved data security, and greater transparency in academic data management, making it a reliable solution for modern educational institutions.

### Project Members
1. SHAIKH MOHD KAIF ASFAQUE AHMED  [ Team Leader ] 
2. PANDEY SUSHANT ASHOK
3. SAMEER CHOUDHARI
4. ARIB SHAIKH

### Project Guides
  PROF. MANILA GUPTA

### Deployment Steps
Please follow the below steps to run this project.
1. Prerequisites
- **Node.js** (v18 or higher)
- **MetaMask** browser extension ([Download MetaMask](https://metamask.io/))

### 2. Installation
Clone the repository and install all dependencies:
 In the root directory (smart contract environment)
npm install
# In the frontend directory
cd frontend
npm install
cd 
### 3. Compile Smart Contracts
Compile the Solidity smart contracts:
npm run compile
This compiles contracts/StudentManagement.sol and automatically places the ABI artifacts into frontend/src/artifacts/.
### 4. Run Automated Unit Tests
Run the contract test suite:
npm test
### 5. Start Local Blockchain & Deploy
#### Terminal 1: Launch Local Hardhat Node
This starts a local Ethereum node at http://127.0.0.1:8545 with 20 pre-funded test accounts (10,000 ETH each).*
Terminal 2: Deploy Contract
*This deploys StudentManagement.sol to your local node and writes the contract address to frontend/src/contractConfig.json`.*
Terminal 3: Start React Frontend
Open **[http://localhost:5173](http://localhost:5173)** in your browser!
## 🦊 Setting Up MetaMask for Local Testing
1. Open **MetaMask** &rarr; **Add Network** &rarr; **Add a network manually**:
   - Network Name: Hardhat Localhost
   - New RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
2. Import Pre-Funded Test Account:
   - In MetaMask, click Import Account and paste one of the Hardhat private keys:
     - Admin / Deployer: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
     - Student (Alex Rivera): 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
3. Click Connect MetaMask in the EduChain navbar to begin!
### Subject Details
- Class : BE (COMP) Div B - 2026-2027
- Subject : Block Chain & Lab (BC)
- Project Type : Mini Project
### Platform, Libraries and Frameworks used
1. [Ethereum](https://ethereum.org/) – Decentralized blockchain platform
2. [Solidity](https://soliditylang.org/) – Smart contract development
3. [React.js](https://react.dev/) – Frontend user interface
### Dataset Used
 This project does not rely on a traditional dataset.
- Data is generated and stored dynamically (student records, certificates, etc.)

### References
- https://ethereum.org/
- https://soliditylang.org/
