import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonWallet } from '../wrappers/JettonWallet';

export async function run(provider: NetworkProvider, args: string[]) {
    if (!args[0]) {
        throw new Error("Jetton wallet address must be provided as an argument");
    }
    
    try {
        const walletAddress = Address.parse(args[0]);
        const jettonWallet = provider.open(new JettonWallet(walletAddress));
        
        const walletData = await jettonWallet.getGetWalletData();
        
        console.log('Jetton Wallet Data:');
        console.log('Balance:', walletData.balance.toString());
        console.log('Owner Address:', walletData.owner.toString());
        console.log('Minter Address:', walletData.minter.toString());
        console.log('Code Cell Hash:', walletData.code.hash().toString('hex'));
        
        return walletData;
    } catch (error) {
        console.error('Error getting wallet data:', error);
        throw error;
    }
} 