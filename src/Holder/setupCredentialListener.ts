import {
    Agent,
    CredentialEventTypes,
    CredentialState,
    CredentialStateChangedEvent,
} from "@aries-framework/core";
const fs = require("fs");

// setup credential listener - listens for received credentials
export const setupCredentialListener = (holder: Agent) => {
    holder.events.on<CredentialStateChangedEvent>(
        CredentialEventTypes.CredentialStateChanged,
        async ({ payload }) => {
            switch (payload.credentialRecord.state) {
                case CredentialState.OfferReceived:
                    console.log("Received a credential...");
                    // Always accepting the credentials for this basic flow
                    await holder.credentials.acceptOffer({
                        credentialRecordId: payload.credentialRecord.id,
                    });

                    // storing the credentialRecord connectionId for verification purposes.
                    const connection = {
                        id: payload.credentialRecord.connectionId,
                    };
                    fs.writeFileSync(
                        "./connectionId.json",
                        JSON.stringify(connection)
                    );
                case CredentialState.Done:
                    console.log(
                        `Credential for credential id ${payload.credentialRecord.id} is accepted`
                    );
                    console.log("The received credential record is");
                    console.dir(payload.credentialRecord);
            }
        }
    );
};
