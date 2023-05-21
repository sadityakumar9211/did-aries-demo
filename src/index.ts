// I will just import the functions and call the functions from here itself. (or maybe export the function from here)
// initialize a holder
// initialize the issuer
// initiate a connection request and complete the connection by receiving the connection
// issue a credential to the holder

import { Agent } from "@aries-framework/core";
import { initializeHolderAgent } from "./Holder/initializeHolderAgent";
import { initializeIssuerAgent } from "./Issuer/initializeIssuerAgent";
import { registerSchema } from "./Issuer/registerSchema";
import { registerCredentialDefinition } from "./Issuer/registerCredentialDefinition";
import { issueCredential } from "./Issuer/issueCredential";
import { setupCredentialListener } from "./Holder/setupCredentialListener";
import { createNewInvitation } from "./Issuer/createNewInvitation";
import { setupConnectionListener } from "./Issuer/setupConnectionListener";
import { receiveInvitation } from "./Holder/receiveInvitation";
require('dotenv').config()

// flow of the issuing credential
const flow = (issuer: Agent) => async (connectionId: string) => {
    console.log("Registering the schema...");
    const schema = await registerSchema(issuer);
    console.log("Registering the credential definition...");
    const credentialDefinition = await registerCredentialDefinition(
        issuer,
        schema
    );
    console.log("Issuing the credential...");
    await issueCredential(issuer, credentialDefinition.id, connectionId);
};

const setupAndIssueCredential = async () => {
    console.log("Initializing the holder...");
    const holder = await initializeHolderAgent();
    console.log("Initializing the issuer...");
    const issuer = await initializeIssuerAgent();

    console.log("Initializing the credential listener...");
    setupCredentialListener(holder);

    console.log("Initializing the connection...");
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(
        issuer
    );
    setupConnectionListener(issuer, outOfBandRecord, flow(issuer));
    await receiveInvitation(holder, invitationUrl);
};

void setupAndIssueCredential();



// Verification of Credentials
// 1. Request for proof
// 2. Receive of Request and Presentation of Proof
// 3. Verify the proof



