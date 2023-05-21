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
};

let outOfBandId: string

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
    outOfBandId = outOfBandRecord.id
    setupConnectionListener(issuer, outOfBandRecord, flow(issuer));
    await receiveInvitation(holder, invitationUrl);
};

void setupAndIssueCredential();

// Verification of Credentials
// 1. Request for proof
// 2. Receive of Request and Presentation of Proof
// 3. Verify the proof

// indy: {
//     credentialDefinitionId,
//     attributes: [
//         { name: "name", value: "Jane Doe" },
//         { name: "age", value: "23" },
//     ],
// },

const newProofAttribute = async () => {
    console.log("Creating new proof attribute for 'name'...");
    const credentialDefinition = JSON.parse(
        fs.readFileSync("../credentialDefinition.json", "utf-8")
    );
    const proofAttribute = {
        name: {
            name: "name",
            restrictions: [
                {
                    credentialDefinitionId:
                        credentialDefinition?.credentialDefinitionId,
                },
            ],
        },
    };

    return proofAttribute;
};

const getConnectionRecord = async (issuer: Agent) => {
    if (!outOfBandId) {
        console.error("Missing Connection Record...");
    }

    const [connection] = await issuer.connections.findAllByOutOfBandId(
        outOfBandId
    );

    if (!connection) {
        console.error("Missing Connection Record...");
    }

    return connection;
};

const sendProofRequest = async (issuer: Agent) => {
    const connectionRecord = await getConnectionRecord(issuer);
    const proofAttribute = await newProofAttribute();
    console.log("Requesting Proof...");

    await issuer.proofs.requestProof({
        protocolVersion: "v2",
        connectionId: connectionRecord.id,
        proofFormats: {
            indy: {
                name: "proof-request",
                version: "1.0",
                requestedAttributes: proofAttribute,
            },
        },
    });
};
