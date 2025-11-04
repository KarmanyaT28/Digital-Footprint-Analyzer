// backend/ingestData.js
require('dotenv').config();
const axios = require('axios');

// --- Configuration ---
const BACKEND_PORT = process.env.PORT || 5001; // Use the port you set in .env
const API_BASE = `http://localhost:${BACKEND_PORT}/api`;

// --- 1. Simulated OSINT Data ---
// This data structure MUST match your backend/models/Footprint.js schema
const sampleFootprintData = {
    targetName: "TargetCo.com",
    sourceDomains: ["targetco.com", "mail.targetco.net", "blog.targetco.info"],
    emails: [
        "john.doe@targetco.com",
        "hr@targetco.com",
        "sales@targetco.info",
        "johndoe1985@gmail.com" // Example of cross-site leakage
    ],
    usernames: ["JohnD1985", "TargetHR"],
    technicalData: [ // Simulated Nmap data
        {
            ipAddress: "192.0.2.10",
            openPorts: [
                { port: 80, service: "http" },
                { port: 443, service: "https" }
            ]
        },
        {
            ipAddress: "192.0.2.11",
            openPorts: [
                { port: 22, service: "ssh" },
                { port: 21, service: "ftp" } // High exposure!
            ]
        }
    ],
    exposureScore: 8 // Manually set for demonstration
};


const ingestData = async () => {
    let token = null;

    try {
        // --- 2. Zero Trust Step 1: Authentication (Login) ---
        console.log("1. Attempting login to obtain JWT...");
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            // These match the temporary credentials in your authRoutes.js
            username: 'analyzer', 
            password: 'password'
        });
        
        token = loginRes.data.token;
        console.log("   ✅ Login successful. JWT received.");

        // --- 3. Zero Trust Step 2: Access Protected Resource (Ingest Data) ---
        // Configure headers to include the JWT for verification
        const config = {
            headers: {
                'x-auth-token': token // The required header for the auth middleware
            }
        };

        console.log("2. Sending OSINT data to protected /ingest endpoint...");
        const ingestRes = await axios.post(`${API_BASE}/footprint/ingest`, sampleFootprintData, config);
        
        console.log("   ✅ Data ingestion successful!");
        console.log("   New Footprint ID:", ingestRes.data._id);

    } catch (error) {
        console.error("\n--- Data Ingestion FAILED ---");
        if (error.response) {
            // This happens if the Zero Trust middleware blocks the request (401)
            console.error(`Status ${error.response.status}: ${error.response.data.msg}`);
            if (error.response.status === 401) {
                console.error("HINT: JWT was invalid or missing. Zero Trust Policy DENIED access.");
            } else {
                 // Or if the data failed schema validation (400)
                console.error("HINT: Check your sampleFootprintData structure.");
            }
        } else {
            console.error("Connection error. Is the backend server running?", error.message);
        }
    }
};

ingestData();