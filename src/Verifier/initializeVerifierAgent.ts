import {
    Agent,
    AutoAcceptCredential,
    HttpOutboundTransport,
    InitConfig,
    WsOutboundTransport,
} from "@aries-framework/core";
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node";
import { getGenesisTransaction } from "../../utils/getGenesisTransaction";

export const initializeVerifierAgent = async () => {
    const genesisTransactionsBCovrinTestNet = await getGenesisTransaction(
        "http://test.bcovrin.vonx.io/genesis"
    );
    const config: InitConfig = {
        label: "demo-agent-verifier",
        walletConfig: {
            id: "demo-agent-verifier",
            key: process.env.VERIFIER_WALLET_KEY!,
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
        endpoints: ["http://localhost:3003"],
    };

    // A new instance of an agent is created here
    const agent = new Agent({ config, dependencies: agentDependencies });

    // Register a simple `WebSocket` outbound transport
    agent.registerOutboundTransport(new WsOutboundTransport());


    // Register a simple `Http` outbound transport
    agent.registerOutboundTransport(new HttpOutboundTransport());

    // Register a simple `Http` inbound transport
    agent.registerInboundTransport(new HttpInboundTransport({ port: 3003 }));

    // Initialize the agent
    await agent.initialize();

    return agent;
};
