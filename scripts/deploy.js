import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Reading contract artifact...");
  const artifactPath = path.resolve(__dirname, "../frontend/src/artifacts/contracts/StudentManagement.sol/StudentManagement.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Connect to local hardhat node (or in-memory provider)
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  try {
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, "chainId:", network.chainId);
    const signer = await provider.getSigner(0);
    const address = await signer.getAddress();
    console.log("Deployer address:", address);

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    console.log("Deploying StudentManagement contract...");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();
    console.log("StudentManagement deployed to:", deployedAddress);

    // Save contract address and ABI directly for frontend
    const deployConfig = {
      address: deployedAddress,
      network: "localhost",
      chainId: Number(network.chainId),
      deployedAt: new Date().toISOString(),
    };

    const frontendConfigPath = path.resolve(__dirname, "../frontend/src/contractConfig.json");
    fs.writeFileSync(frontendConfigPath, JSON.stringify(deployConfig, null, 2));
    console.log("Deployment details saved to frontend/src/contractConfig.json");
  } catch (err) {
    console.log("Notice: Hardhat local node is not running yet. Run 'npx hardhat node' before deploying to localhost.");
    console.log("Error details:", err.message);
  }
}

main().catch(console.error);
