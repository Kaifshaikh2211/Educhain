import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("StudentManagement Smart Contract Unit & Integrity Tests", () => {
  const artifactPath = path.resolve(
    __dirname,
    "../frontend/src/artifacts/contracts/StudentManagement.sol/StudentManagement.json"
  );

  it("Artifact exists, compiles cleanly, and exposes ABI and Bytecode", () => {
    assert.ok(fs.existsSync(artifactPath), "Artifact file should exist");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    
    assert.strictEqual(artifact.contractName, "StudentManagement");
    assert.ok(Array.isArray(artifact.abi), "ABI must be an array");
    assert.ok(artifact.bytecode.length > 2, "Bytecode should be generated and non-empty");
  });

  it("Contract defines all core administrative & student functions", () => {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const functionNames = artifact.abi
      .filter((item) => item.type === "function")
      .map((item) => item.name);

    const requiredFunctions = [
      "addAdmin",
      "removeAdmin",
      "isAdmin",
      "registerStudent",
      "updateStudent",
      "addCertificate",
      "getStudentRecord",
      "getStudentRecordById",
      "getStudentCertificates",
      "getAllStudents",
      "verifyCertificateByHash",
      "getSystemStats"
    ];

    for (const fn of requiredFunctions) {
      assert.ok(
        functionNames.includes(fn),
        `Function '${fn}' should be defined in contract ABI`
      );
    }
  });

  it("Contract defines critical audit trail events for blockchain transparency", () => {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const eventNames = artifact.abi
      .filter((item) => item.type === "event")
      .map((item) => item.name);

    assert.ok(eventNames.includes("StudentRegistered"), "Event StudentRegistered must exist");
    assert.ok(eventNames.includes("StudentUpdated"), "Event StudentUpdated must exist");
    assert.ok(eventNames.includes("CertificateIssued"), "Event CertificateIssued must exist");
    assert.ok(eventNames.includes("AdminAdded"), "Event AdminAdded must exist");
  });
});
