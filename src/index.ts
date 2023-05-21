// I will just import the functions and call the functions from here itself. (or maybe export the function from here)
// initialize a holder
// initialize the issuer
// initiate a connection request and complete the connection by receiving the connection
// issue a credential to the holder

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

// Verification of Credentials
// 1. Request for proof
// 2. Receive of Request and Presentation of Proof
// 3. Verify the proof

const newProofAttribute = async () => {
    console.log("Creating new proof attribute for 'name'...");
    const credentialDefinition = JSON.parse(
        fs.readFileSync("./credentialDefinition.json", "utf-8")
    );
    const proofAttribute = new ProofAttributeInfo({
        name: "name",
        restrictions: [
            new AttributeFilter({
                credentialDefinitionId: credentialDefinition?.id,
            }),
        ],
    });

    return proofAttribute;
};

const getConnectionRecord = async (issuer: Agent) => {
    if (!outOfBandId) {
        console.error("Missing Connection Record...");
    }

    //As there is only one connection to the issuer in this scenario

    const [connection] = await issuer.connections.findAllByOutOfBandId(
        outOfBandId
    );

    if (!connection) {
        console.error("Missing Connection Record...");
    }

    return connection;
};

const sendProofRequest = async (verifier: Agent, issuer: Agent) => {
    const connectionRecord = await getConnectionRecord(issuer);
    const proofAttribute = await newProofAttribute();
    console.log("Requesting Proof...");

    const attributes: Record<string, ProofAttributeInfo> = {};

    attributes["attr_1"] = proofAttribute;
    console.log("Just before requesting proof....")

    const proofExchangeRecord = await verifier.proofs.requestProof({
        protocolVersion: "v2",
        connectionId: connectionRecord?.id,
        proofFormats: {
            indy: {
                name: "proof-request",
                version: "1.0",
                requestedAttributes: attributes,
            },
        },
        autoAcceptProof: AutoAcceptProof.ContentApproved,
    });
    console.log("Just after requesting proof...")

    console.log({ proofExchangeRecord });
    if (proofExchangeRecord.isVerified) {
        console.log("The credentials are verified...");
    } else if (proofExchangeRecord.state) {
        console.log(proofExchangeRecord.state);
    } else {
        console.log(proofExchangeRecord.errorMessage);
    }
};

const proofRequestListener = (
    holder: Agent /*, aliceInquirer: AliceInquirer */
) => {
    holder.events.on(
        ProofEventTypes.ProofStateChanged,
        async ({ payload }: ProofStateChangedEvent) => {
            if (payload.proofRecord.state === ProofState.RequestReceived) {
                console.log("Just before accepting Proof Request...")
                await acceptProofRequest(holder, payload.proofRecord);
            }
        }
    );
};

const acceptProofRequest = async (
    holder: Agent,
    proofRecord: ProofExchangeRecord
) => {
    const requestedCredentials =
        await holder.proofs.autoSelectCredentialsForProofRequest({
            proofRecordId: proofRecord.id,
        });

    await holder.proofs.acceptRequest({
        proofRecordId: proofRecord.id,
        proofFormats: requestedCredentials.proofFormats,
    });
    console.log("Proof Request Accepted...");
};

void setupAndIssueCredential();
