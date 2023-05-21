import { Agent } from "@aries-framework/core";
import { Schema } from "indy-sdk";

// register credential definition - binding the schema with the issuer
export const registerCredentialDefinition = async (
    issuer: Agent,
    schema: Schema
) => {
    const credentialDefinition = issuer.ledger.registerCredentialDefinition({
        schema,
        supportRevocation: false,
        tag: "default",
    });
    return credentialDefinition;
};
