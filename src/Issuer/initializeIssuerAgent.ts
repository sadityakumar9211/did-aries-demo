import {
    Agent,
    AutoAcceptCredential,
    HttpOutboundTransport,
    InitConfig,
    WsOutboundTransport,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import { getGenesisTransaction } from "../../utils/getGenesisTransaction";

export const initializeIssuerAgent = async () => {
    const genesisTransactionsBCovrinTestNet = await getGenesisTransaction(
        "http://test.bcovrin.vonx.io/genesis"
    );
    
    const config: InitConfig = {
        label: "demo-agent-issuer",
        walletConfig: {
            id: "demo-agent-issuer",
            key: process.env.ISSUER_WALLET_KEY!,
        },
        publicDidSeed: process.env.ISSUER_PUBLIC_SEED,
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
        endpoints: ["http://localhost:3001"],
    };

    // A new instance of an agent is created here
    const agent = new Agent({ config, dependencies: agentDependencies });

    // Register a simple `WebSocket` outbound transport
    agent.registerOutboundTransport(new WsOutboundTransport());

    // Register a simple `Http` outbound transport
    agent.registerOutboundTransport(new HttpOutboundTransport());

    // Register a simple `Http` inbound transport
    agent.registerInboundTransport(new HttpInboundTransport({ port: 3001 }));

    // Initialize the agent
    await agent.initialize();

    return agent;
};
