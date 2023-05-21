import {
    Agent,
    AutoAcceptCredential,
    HttpOutboundTransport,
    InitConfig,
    WsOutboundTransport,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import { getGenesisTransaction } from "../../utils/getGenesisTransaction";

export const initializeHolderAgent = async () => {
    const genesisTransactionsBCovrinTestNet = await getGenesisTransaction(
        "http://test.bcovrin.vonx.io/genesis"
    );
    // Simple agent configuration. This sets some basic fields like the wallet
    // configuration and the label. It also sets the mediator invitation url,
    // because this is most likely required in a mobile environment.
    const config: InitConfig = {
        label: "demo-agent-holder",
        walletConfig: {
            id: "demo-agent-holder",
            key: process.env.HOLDER_WALLET_KEY!,
        },
        indyLedgers: [
            {
                id: "bcovrin-test-net",
                isProduction: false,
                indyNamespace: "bcovrin:test",
                genesisTransactions: genesisTransactionsBCovrinTestNet,
            },
        ],
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        autoAcceptConnections: true,
        endpoints: ["http://localhost:3002"],
    };

    // A new instance of an agent is created here
    const agent = new Agent({ config, dependencies: agentDependencies });

    // Register a simple `WebSocket` outbound transport
    agent.registerOutboundTransport(new WsOutboundTransport());

    // Register a simple `Http` outbound transport
    agent.registerOutboundTransport(new HttpOutboundTransport());

    // Register a simple `Http` inbound transport
    agent.registerInboundTransport(new HttpInboundTransport({ port: 3002 }));

    // Initialize the agent
    await agent.initialize();

    return agent;
};
