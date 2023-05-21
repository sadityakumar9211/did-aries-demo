import { Agent } from "@aries-framework/core";

// issue credentials - issues the credentials
export const issueCredential = async (
    issuer: Agent,
    credentialDefinitionId: string,
    connectionId: string
) =>
    issuer.credentials.offerCredential({
        protocolVersion: "v1",
        connectionId,
        credentialFormats: {
            indy: {
                credentialDefinitionId,
                attributes: [
                    { name: "name", value: "Jane Doe" },
                    { name: "age", value: "23" },
                ],
            },
        },
    });
