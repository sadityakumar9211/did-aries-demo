import {
    Agent,
    AutoAcceptProof,
    ProofAttributeInfo,
} from "@aries-framework/core";
import { newProofAttribute } from "./newProofAttribute";
const fs = require("fs");

export const sendProofRequest = async (verifier: Agent) => {
    const connection = JSON.parse(
        fs.readFileSync("./connectionId.json", "utf-8")
    );

    if (!connection.id) {
        console.log(
            "No connection between the issuer and the holder exits now..."
        );
    }

    const proofAttribute = await newProofAttribute();
    console.log("Requesting Proof...");

    const attributes: Record<string, ProofAttributeInfo> = {};

    attributes["attr_1"] = proofAttribute;
    console.log("Just before requesting proof....");

    const proofExchangeRecord = await verifier.proofs.requestProof({
        protocolVersion: "v2",
        connectionId: connection.id,
        proofFormats: {
            indy: {
                name: "proof-request",
                version: "1.0",
                requestedAttributes: attributes,
            },
        },
        autoAcceptProof: AutoAcceptProof.ContentApproved,
    });
    console.log("Just after requesting proof...");

    console.log({ proofExchangeRecord });
    if (proofExchangeRecord.isVerified) {
        console.log("The credentials are verified...");
    } else if (proofExchangeRecord.state) {
        console.log(proofExchangeRecord.state);
    } else {
        console.log(proofExchangeRecord.errorMessage);
    }
};
