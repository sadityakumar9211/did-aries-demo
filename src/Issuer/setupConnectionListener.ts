import {
    Agent,
    ConnectionEventTypes,
    ConnectionStateChangedEvent,
    DidExchangeState,
    OutOfBandRecord,
} from "@aries-framework/core";
const fs = require("fs");

//setup connection listener
export const setupConnectionListener = (
    issuer: Agent,
    outOfBandRecord: OutOfBandRecord,
    cb: (...args: any) => Promise<unknown>
) => {
    issuer.events.on<ConnectionStateChangedEvent>(
        ConnectionEventTypes.ConnectionStateChanged,
        async ({ payload }) => {
            if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id)
                return;
            if (payload.connectionRecord.state === DidExchangeState.Completed) {
                // the connection is now ready for usage in other protocols!
                console.log(
                    `Connection for out-of-band id ${outOfBandRecord.id} completed`
                );

                console.log(payload.connectionRecord.id);
                // const connection = {
                //     id: payload.connectionRecord.id,
                // };
                // fs.writeFileSync(
                //     "./connectionId.json",
                //     JSON.stringify(connection)
                // );
                await cb(payload.connectionRecord.id);
            }
        }
    );
};
