// This module is used for issuing credentials

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

import { proofRequestListener } from "./Holder/proofRequestListener";
import { sendProofRequest } from "./Verifier/sendProofRequest";

const fs = require("fs");
require("dotenv").config();

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

    console.log("Requesting Proof...");
    await sendProofRequest(issuer);
};

const setupAndIssueCredential = async () => {
    console.log("Initializing the holder...");
    const holder = await initializeHolderAgent();
    console.log("Initializing the issuer...");
    const issuer = await initializeIssuerAgent();

    console.log("Initializing the credential listener...");
    setupCredentialListener(holder);
    proofRequestListener(holder);

    console.log("Initializing the connection...");
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(
        issuer
    );

    setupConnectionListener(issuer, outOfBandRecord, flow(issuer));
    await receiveInvitation(holder, invitationUrl);

    // console.log("Initializing the verifier...");
    // const verifier = await initializeVerifierAgent();
};

void setupAndIssueCredential();
