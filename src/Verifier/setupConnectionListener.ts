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
    verifier: Agent,
    outOfBandRecord: OutOfBandRecord,
    cb: (...args: any) => Promise<unknown>
) => {
    verifier.events.on<ConnectionStateChangedEvent>(
        ConnectionEventTypes.ConnectionStateChanged,
        async ({ payload }) => {
            if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id)
                return;
            if (payload.connectionRecord.state === DidExchangeState.Completed) {
                // the connection is now ready for usage in other protocols!
                console.log(
                    `Connection for out-of-band id ${outOfBandRecord.id} completed between verfier and holder...`
                );

                console.log(payload.connectionRecord.id);

                const [connection] =
                    await verifier.connections.findAllByOutOfBandId(
                        outOfBandRecord.id
                    );

                console.dir(connection);

                // await fs.writeFileSync(
                //     "./connection.json",
                //     JSON.stringify(connection)
                // );
                // console.log("Written connection successfully...");

                await cb(verifier);
            }
        }
    );
};
