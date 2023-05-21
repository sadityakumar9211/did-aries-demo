import { Agent } from "@aries-framework/core";

// create new invitation
export const createNewInvitation = async (issuer: Agent) => {
    const outOfBandRecord = await issuer.oob.createInvitation();

    return {
        invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
            domain: "https://example.org",
        }),
        outOfBandRecord,
    };
};
