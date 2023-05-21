import { Agent } from "@aries-framework/core";

export const registerSchema = async (issuer: Agent) =>
    issuer.ledger.registerSchema({
        attributes: ["name", "age"],
        name: "Identity",
        version: "1.0",
    });
