import { NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import { JETTON_MINTER_ADDRESS } from '../config';
import { Address } from '@ton/core';

export async function run(provider: NetworkProvider, args: string[]) {
    if (!args[0]) {
        throw new Error("Owner address must be provided as an argument");
    }
    
    try {
        const ownerAddress = Address.parse(args[0]);
        
        const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
        const walletAddress = await jettonMinter.getGetWalletAddress(ownerAddress);
        
        console.log('Jetton Wallet Address:', walletAddress.toString());

        const jettonWallet = provider.open(new JettonWallet(walletAddress));
        
        try {
            const walletData = await jettonWallet.getGetWalletData();
            
            console.log('Owner Address:', walletData.owner.toString());
            console.log('Balance:', walletData.balance.toString());
            
            return walletData.balance;
        } catch (error) {
            console.error('Error getting wallet data. The wallet might not be deployed yet:', error);
            return null;
        }
    } catch (error) {
        console.error('Error parsing address:', error);
        throw error;
    }
} 