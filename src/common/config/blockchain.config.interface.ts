export interface BlockchainConfig {
  blockchain: {
    rpcUrl: string;
    privateKey: string;
    gameContract: string;
    badgeContract: string;
  };
}
