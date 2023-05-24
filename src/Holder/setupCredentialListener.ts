import {
    Agent,
    CredentialEventTypes,
    CredentialState,
    CredentialStateChangedEvent,
} from "@aries-framework/core";
import { sendProofRequest } from "../Verifier/sendProofRequest";
const fs = require("fs");

// setup credential listener - listens for received credentials
export const setupCredentialListener = (holder: Agent, issuer: Agent) => {
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
                    await sendProofRequest(issuer);
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
