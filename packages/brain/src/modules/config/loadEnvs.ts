import { ConsensusClient, ExecutionClient, Network } from "@stakingbrain/common";

export function loadEnvs(): {
  network: Network;
  executionClient: ExecutionClient;
  consensusClient: ConsensusClient;
  isMevBoostSet: boolean;
  cors: string | string[] | null;
} {
  const network = getNetwork();

  const executionClient = getExecutionClient(network);
  const consensusClient = getConsensusClient(network);

  const isMevBoostSet = process.env[`_DAPPNODE_GLOBAL_MEVBOOST_${network.toUpperCase()}`] === "true";

  const origins = process.env.CORS ? process.env.CORS.split(",") : null;
  let cors: string | string[] | null = null;
  if (origins) {
    if (origins.length > 1) cors = origins;
    else if (origins.length === 1) cors = origins[0];
  }

  return {
    network: network as Network,
    executionClient,
    consensusClient,
    isMevBoostSet,
    cors
  };
}

function getNetwork(): Network {
  const network = process.env.NETWORK;
  if (!network) throw Error("NETWORK env is required");

  if (network === Network.Mainnet) return Network.Mainnet;
  if (network === Network.Prater) return Network.Prater;
  if (network === Network.Gnosis) return Network.Gnosis;
  if (network === Network.Lukso) return Network.Lukso;
  if (network === Network.Holesky) return Network.Holesky;
  if (network === Network.Hoodi) return Network.Hoodi;

  throw Error(`NETWORK env must be one of ${Object.values(Network).join(", ")}`);
}

function getExecutionClient(network: Network): ExecutionClient {
  const executionClientStr = process.env[`_DAPPNODE_GLOBAL_EXECUTION_CLIENT_${network.toUpperCase()}`];
  if (!executionClientStr) throw Error(`_DAPPNODE_GLOBAL_EXECUTION_CLIENT_${network.toUpperCase()} env is required`);

  if (executionClientStr.includes(ExecutionClient.Geth)) return ExecutionClient.Geth;
  if (executionClientStr.includes(ExecutionClient.Besu)) return ExecutionClient.Besu;
  if (executionClientStr.includes(ExecutionClient.Nethermind)) return ExecutionClient.Nethermind;
  if (executionClientStr.includes(ExecutionClient.Erigon)) return ExecutionClient.Erigon;
  if (executionClientStr.includes(ExecutionClient.Reth)) return ExecutionClient.Reth;
  return ExecutionClient.Unknown;
}

function getConsensusClient(network: Network): ConsensusClient {
  const consensusClientStr = process.env[`_DAPPNODE_GLOBAL_CONSENSUS_CLIENT_${network.toUpperCase()}`];
  if (!consensusClientStr) throw Error(`_DAPPNODE_GLOBAL_CONSENSUS_CLIENT_${network.toUpperCase()} env is required`);

  if (consensusClientStr.includes(ConsensusClient.Teku)) return ConsensusClient.Teku;
  if (consensusClientStr.includes(ConsensusClient.Prysm)) return ConsensusClient.Prysm;
  if (consensusClientStr.includes(ConsensusClient.Lighthouse)) return ConsensusClient.Lighthouse;
  if (consensusClientStr.includes(ConsensusClient.Nimbus)) return ConsensusClient.Nimbus;
  if (consensusClientStr.includes(ConsensusClient.Lodestar)) return ConsensusClient.Lodestar;
  return ConsensusClient.Unknown;
}
