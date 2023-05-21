import {
    Agent,
    ConnectionEventTypes,
    ConnectionStateChangedEvent,
    DidExchangeState,
    OutOfBandRecord,
} from "@aries-framework/core";

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

                // Custom business logic can be included here
                // In this example we can send a basic message to the connection, but
                // anything is possible
                console.log(payload.connectionRecord.id);
                await cb(payload.connectionRecord.id);
            }
        }
    );
};
