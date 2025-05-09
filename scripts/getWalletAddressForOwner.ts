import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';
import { Address } from '@ton/core';

export async function run(provider: NetworkProvider, args: string[]) {
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    
    if (!args[0]) {
        throw new Error("Owner address must be provided as an argument");
    }
    
    try {
        const ownerAddress = Address.parse(args[0]);
        const walletAddress = await jettonMinter.getGetWalletAddress(ownerAddress);
        
        console.log('Jetton Wallet Information:');
        console.log('Owner Address:', ownerAddress.toString());
        console.log('Wallet Address:', walletAddress.toString());
        
        return walletAddress;
    } catch (error) {
        console.error('Error parsing address:', error);
        throw error;
    }
} 