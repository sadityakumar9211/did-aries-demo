import { receiveInvitation } from "./Holder/receiveInvitation";
import { createNewInvitation } from "./Issuer/createNewInvitation";
import { initializeVerifierAgent } from "./Verifier/initializeVerifierAgent";
import { sendProofRequest } from "./Verifier/sendProofRequest";
import { setupConnectionListener } from "./Verifier/setupConnectionListener";
require("dotenv").config();

export const verifyCredentials = async () => {
    console.log("Initializing the Verifier...");
    const verifier = await initializeVerifierAgent();

    // // connecting the verifier with the holder
    // console.log("Initializing the connection...");
    // const { outOfBandRecord, invitationUrl } = await createNewInvitation(
    //     verifier
    // );

    // setupConnectionListener(verifier, outOfBandRecord, (verifier) =>
    //     sendProofRequest(verifier)
    // );
    // await receiveInvitation(holder, invitationUrl);

    sendProofRequest(verifier);

};

void verifyCredentials();
