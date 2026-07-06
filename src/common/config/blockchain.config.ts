import { BlockchainConfig } from './blockchain.config.interface';

export default (): BlockchainConfig => ({
  blockchain: {
    rpcUrl: process.env.RPC_URL as string,
    privateKey: process.env.PRIVATE_KEY as string,
    gameContract: process.env.GAME_CONTRACT as string,
    badgeContract: process.env.BADGE_CONTRACT as string,
  },
});
