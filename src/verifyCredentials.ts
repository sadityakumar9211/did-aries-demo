import { initializeVerifierAgent } from "./Verifier/initializeVerifierAgent";
import { sendProofRequest } from "./Verifier/sendProofRequest";
require("dotenv").config();

export const verifyCredentials = async () => {
    console.log("Initializing the Verifier...");
    const verifier = await initializeVerifierAgent();
    void (await sendProofRequest(verifier));
};

void verifyCredentials();
