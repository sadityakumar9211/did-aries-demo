import { Agent } from "@aries-framework/core";
import { Schema } from "indy-sdk";
const fs = require("fs");

// register credential definition - binding the schema with the issuer
export const registerCredentialDefinition = async (
    issuer: Agent,
    schema: Schema
) => {
    let credentialDefinition = JSON.parse(
        await fs.readFileSync("./credentialDefinition.json", "utf-8")
    );
    if (credentialDefinition.id == undefined) {
        credentialDefinition = issuer.ledger.registerCredentialDefinition({
            schema,
            supportRevocation: false,
            tag: "default",
        });
    } else {
        console.log(
            "Credential Definition Already Registered on the ledger..."
        );
    }
    return credentialDefinition;
};
