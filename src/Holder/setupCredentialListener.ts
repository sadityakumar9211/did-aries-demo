import {
    Agent,
    CredentialEventTypes,
    CredentialState,
    CredentialStateChangedEvent,
} from "@aries-framework/core";

// setup credential listener - listens for received credentials
export const setupCredentialListener = (holder: Agent) => {
    holder.events.on<CredentialStateChangedEvent>(
        CredentialEventTypes.CredentialStateChanged,
        async ({ payload }) => {
            switch (payload.credentialRecord.state) {
                case CredentialState.OfferReceived:
                    console.log("received a credential");
                    // custom logic here
                    await holder.credentials.acceptOffer({
                        credentialRecordId: payload.credentialRecord.id,
                    });
                case CredentialState.Done:
                    console.log(
                        `Credential for credential id ${payload.credentialRecord.id} is accepted`
                    );
                    console.log("The received credential record is");
                    console.dir(payload.credentialRecord);
                    // For demo purposes we exit the program here.
                    process.exit(0);
            }
        }
    );
};
