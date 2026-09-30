// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StudentManagement
 * @dev Secure, transparent, and decentralized platform for managing academic records and verifiable credentials
 */
contract StudentManagement {
    address public owner;

    // Academic Credential / Certificate structure
    struct Certificate {
        string title;
        string ipfsHash;
        string issueDate;
        uint256 timestamp;
        address issuedBy;
    }

    // Student Record structure
    struct Student {
        address studentAddress;
        string studentId;          // Roll Number / University Registration ID
        string name;
        string department;
        string email;
        string cgpa;
        uint256 graduationYear;
        string certificateIpfsHash;// Primary degree/certificate IPFS CID
        bool isRegistered;
        uint256 registrationTimestamp;
        uint256 lastUpdatedTimestamp;
    }

    // Mappings
    mapping(address => bool) public admins;
    mapping(address => Student) private studentsByAddress;
    mapping(string => address) private studentIdToAddress;
    mapping(address => Certificate[]) private studentCertificates;
    mapping(string => bool) private usedIpfsHashes;

    // State tracking arrays
    address[] private studentAddresses;
    address[] private adminList;
    uint256 public totalCertificatesCount;

    // Events for transparent audit trail on the Ethereum blockchain
    event AdminAdded(address indexed adminAddress, address indexed addedBy);
    event AdminRemoved(address indexed adminAddress, address indexed removedBy);
    event StudentRegistered(
        address indexed studentAddress,
        string indexed studentId,
        string name,
        string department,
        address indexed registeredBy,
        uint256 timestamp
    );
    event StudentUpdated(
        address indexed studentAddress,
        string indexed studentId,
        string name,
        address indexed updatedBy,
        uint256 timestamp
    );
    event CertificateIssued(
        address indexed studentAddress,
        string ipfsHash,
        string title,
        address indexed issuedBy,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Caller is not an authorized administrator");
        _;
    }

    modifier onlyAdminOrStudent(address _studentAddress) {
        require(
            admins[msg.sender] || msg.sender == owner || msg.sender == _studentAddress,
            "Access denied: Not an administrator or the record owner"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        adminList.push(msg.sender);
    }

    // ==========================================
    // ADMIN MANAGEMENT
    // ==========================================

    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid admin address");
        require(!admins[_admin], "Address is already an admin");

        admins[_admin] = true;
        adminList.push(_admin);
        emit AdminAdded(_admin, msg.sender);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner, "Cannot remove the contract owner");
        require(admins[_admin], "Address is not an admin");

        admins[_admin] = false;

        // Remove from adminList
        for (uint256 i = 0; i < adminList.length; i++) {
            if (adminList[i] == _admin) {
                adminList[i] = adminList[adminList.length - 1];
                adminList.pop();
                break;
            }
        }

        emit AdminRemoved(_admin, msg.sender);
    }

    function isAdmin(address _account) external view returns (bool) {
        return admins[_account] || _account == owner;
    }

    function getAdminList() external view returns (address[] memory) {
        return adminList;
    }

    // ==========================================
    // STUDENT RECORD MANAGEMENT
    // ==========================================

    /**
     * @dev Register a new student record onto the blockchain
     */
    function registerStudent(
        address _studentAddress,
        string memory _studentId,
        string memory _name,
        string memory _department,
        string memory _email,
        string memory _cgpa,
        uint256 _graduationYear,
        string memory _certificateIpfsHash
    ) external onlyAdmin {
        require(_studentAddress != address(0), "Invalid student wallet address");
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");
        require(bytes(_name).length > 0, "Student name cannot be empty");
        require(!studentsByAddress[_studentAddress].isRegistered, "Student wallet address already registered");
        require(studentIdToAddress[_studentId] == address(0), "Student ID already exists in the system");

        Student memory newStudent = Student({
            studentAddress: _studentAddress,
            studentId: _studentId,
            name: _name,
            department: _department,
            email: _email,
            cgpa: _cgpa,
            graduationYear: _graduationYear,
            certificateIpfsHash: _certificateIpfsHash,
            isRegistered: true,
            registrationTimestamp: block.timestamp,
            lastUpdatedTimestamp: block.timestamp
        });

        studentsByAddress[_studentAddress] = newStudent;
        studentIdToAddress[_studentId] = _studentAddress;
        studentAddresses.push(_studentAddress);

        // If an initial IPFS certificate hash is provided, record it
        if (bytes(_certificateIpfsHash).length > 0) {
            Certificate memory initialCert = Certificate({
                title: "Degree / Primary Certificate",
                ipfsHash: _certificateIpfsHash,
                issueDate: "At Registration",
                timestamp: block.timestamp,
                issuedBy: msg.sender
            });
            studentCertificates[_studentAddress].push(initialCert);
            usedIpfsHashes[_certificateIpfsHash] = true;
            totalCertificatesCount++;

            emit CertificateIssued(_studentAddress, _certificateIpfsHash, initialCert.title, msg.sender, block.timestamp);
        }

        emit StudentRegistered(
            _studentAddress,
            _studentId,
            _name,
            _department,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Update student record (academics, course, or certificate)
     */
    function updateStudent(
        address _studentAddress,
        string memory _name,
        string memory _department,
        string memory _email,
        string memory _cgpa,
        uint256 _graduationYear,
        string memory _certificateIpfsHash
    ) external onlyAdmin {
        require(studentsByAddress[_studentAddress].isRegistered, "Student does not exist");
        require(bytes(_name).length > 0, "Student name cannot be empty");

        Student storage student = studentsByAddress[_studentAddress];
        student.name = _name;
        student.department = _department;
        student.email = _email;
        student.cgpa = _cgpa;
        student.graduationYear = _graduationYear;
        student.certificateIpfsHash = _certificateIpfsHash;
        student.lastUpdatedTimestamp = block.timestamp;

        emit StudentUpdated(
            _studentAddress,
            student.studentId,
            _name,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Issue an additional academic credential/certificate to a student
     */
    function addCertificate(
        address _studentAddress,
        string memory _title,
        string memory _ipfsHash,
        string memory _issueDate
    ) external onlyAdmin {
        require(studentsByAddress[_studentAddress].isRegistered, "Student does not exist");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_title).length > 0, "Certificate title cannot be empty");

        Certificate memory newCert = Certificate({
            title: _title,
            ipfsHash: _ipfsHash,
            issueDate: _issueDate,
            timestamp: block.timestamp,
            issuedBy: msg.sender
        });

        studentCertificates[_studentAddress].push(newCert);
        usedIpfsHashes[_ipfsHash] = true;
        totalCertificatesCount++;

        emit CertificateIssued(_studentAddress, _ipfsHash, _title, msg.sender, block.timestamp);
    }

    // ==========================================
    // QUERY & VERIFICATION FUNCTIONS
    // ==========================================

    /**
     * @dev Fetch student record by wallet address
     */
    function getStudentRecord(address _studentAddress)
        external
        view
        returns (Student memory)
    {
        require(studentsByAddress[_studentAddress].isRegistered, "Student does not exist");
        return studentsByAddress[_studentAddress];
    }

    /**
     * @dev Fetch student record by student Roll/Registration ID (Public verification)
     */
    function getStudentRecordById(string memory _studentId)
        external
        view
        returns (Student memory)
    {
        address studentAddr = studentIdToAddress[_studentId];
        require(studentAddr != address(0), "No student found with this ID");
        return studentsByAddress[studentAddr];
    }

    /**
     * @dev Fetch all issued certificates for a specific student
     */
    function getStudentCertificates(address _studentAddress)
        external
        view
        returns (Certificate[] memory)
    {
        require(studentsByAddress[_studentAddress].isRegistered, "Student does not exist");
        return studentCertificates[_studentAddress];
    }

    /**
     * @dev Get total count of registered students
     */
    function getTotalStudentsCount() external view returns (uint256) {
        return studentAddresses.length;
    }

    /**
     * @dev Fetch all registered student records (for Admin Portal)
     */
    function getAllStudents() external view returns (Student[] memory) {
        uint256 total = studentAddresses.length;
        Student[] memory allStudents = new Student[](total);

        for (uint256 i = 0; i < total; i++) {
            allStudents[i] = studentsByAddress[studentAddresses[i]];
        }
        return allStudents;
    }

    /**
     * @dev Public verification for third parties (employers, universities) by IPFS Hash
     */
    function verifyCertificateByHash(string memory _ipfsHash)
        external
        view
        returns (
            bool isValid,
            string memory studentName,
            string memory studentId,
            string memory department,
            string memory certificateTitle,
            uint256 timestamp,
            address issuedBy
        )
    {
        if (bytes(_ipfsHash).length == 0) {
            return (false, "", "", "", "", 0, address(0));
        }

        // Loop through registered students and their certificates
        for (uint256 i = 0; i < studentAddresses.length; i++) {
            address sAddr = studentAddresses[i];
            Certificate[] memory certs = studentCertificates[sAddr];
            for (uint256 j = 0; j < certs.length; j++) {
                if (keccak256(bytes(certs[j].ipfsHash)) == keccak256(bytes(_ipfsHash))) {
                    Student memory st = studentsByAddress[sAddr];
                    return (
                        true,
                        st.name,
                        st.studentId,
                        st.department,
                        certs[j].title,
                        certs[j].timestamp,
                        certs[j].issuedBy
                    );
                }
            }
        }

        return (false, "", "", "", "", 0, address(0));
    }

    /**
     * @dev Get system statistics in a single call
     */
    function getSystemStats()
        external
        view
        returns (
            uint256 totalStudents,
            uint256 totalCertificates,
            uint256 totalAdmins
        )
    {
        return (studentAddresses.length, totalCertificatesCount, adminList.length);
    }
}
