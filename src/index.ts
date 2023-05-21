import {
    Agent,
    AttributeFilter,
    AutoAcceptProof,
    ProofAttributeInfo,
    ProofEventTypes,
    ProofExchangeRecord,
    ProofState,
    ProofStateChangedEvent,
} from "@aries-framework/core";
import { initializeHolderAgent } from "./Holder/initializeHolderAgent";
import { initializeIssuerAgent } from "./Issuer/initializeIssuerAgent";
import { registerSchema } from "./Issuer/registerSchema";
import { registerCredentialDefinition } from "./Issuer/registerCredentialDefinition";
import { issueCredential } from "./Issuer/issueCredential";
import { setupCredentialListener } from "./Holder/setupCredentialListener";
import { createNewInvitation } from "./Issuer/createNewInvitation";
import { setupConnectionListener } from "./Issuer/setupConnectionListener";
import { receiveInvitation } from "./Holder/receiveInvitation";
import { initializeVerifierAgent } from "./Verifier/initializeVerifierAgent";
import { sleep } from "../utils/sleep";
import { proofRequestListener } from "./Holder/proofRequestListener";

const fs = require("fs");
require("dotenv").config();


let outOfBandId: string;

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
    proofRequestListener(holder);

    console.log("Initializing the connection...");
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(
        issuer
    );
    setupConnectionListener(issuer, outOfBandRecord, flow(issuer));
    outOfBandId = outOfBandRecord?.id;
    await receiveInvitation(holder, invitationUrl);


    // console.log("Initializing the verifier...");
    // const verifier = await initializeVerifierAgent();
    // void (await sendProofRequest(verifier, issuer));
};


void setupAndIssueCredential();
