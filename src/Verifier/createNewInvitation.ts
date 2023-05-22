import { Agent } from "@aries-framework/core";

// create new invitation
export const createNewInvitation = async (verifier: Agent) => {
    const outOfBandRecord = await verifier.oob.createInvitation();

    return {
        invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
            domain: "https://example.org",
        }),
        outOfBandRecord,
    };
};
