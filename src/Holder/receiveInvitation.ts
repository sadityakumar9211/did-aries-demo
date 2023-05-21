import { Agent } from "@aries-framework/core";

// receive invitation
export const receiveInvitation = async (
    holder: Agent,
    invitationUrl: string
) => {
    const { outOfBandRecord } = await holder.oob.receiveInvitationFromUrl(
        invitationUrl
    );

    return outOfBandRecord;
};
