import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';
import { Address } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    
    const ownerAddress = await provider.sender().address;
    
    if (!ownerAddress) {
        throw new Error("Sender address is not defined");
    }
    
    const walletAddress = await jettonMinter.getGetWalletAddress(ownerAddress);
    
    console.log('Jetton Wallet Information:');
    console.log('Owner Address:', ownerAddress.toString());
    console.log('Wallet Address:', walletAddress.toString());
    
    return walletAddress;
} 