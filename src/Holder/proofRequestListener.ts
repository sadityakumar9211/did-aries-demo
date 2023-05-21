import {
    Agent,
    ProofEventTypes,
    ProofState,
    ProofStateChangedEvent,
} from "@aries-framework/core";
import { acceptProofRequest } from "./acceptProofRequest";

export const proofRequestListener = (holder: Agent) => {
    holder.events.on(
        ProofEventTypes.ProofStateChanged,
        async ({ payload }: ProofStateChangedEvent) => {
            if (payload.proofRecord.state === ProofState.RequestReceived) {
                console.log("Just before accepting Proof Request...");
                await acceptProofRequest(holder, payload.proofRecord);
            }
        }
    );
};
