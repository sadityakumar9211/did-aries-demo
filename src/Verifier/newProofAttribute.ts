import { AttributeFilter, ProofAttributeInfo } from "@aries-framework/core";

const fs = require("fs");

export const newProofAttribute = async () => {
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
