import { NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider) {
    const ownerAddress = await provider.sender().address;
    
    if (!ownerAddress) {
        throw new Error("Sender address is not defined");
    }
    
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    const walletAddress = await jettonMinter.getGetWalletAddress(ownerAddress);
    
    console.log('Jetton Wallet Address:', walletAddress.toString());
    
    const jettonWallet = provider.open(new JettonWallet(walletAddress));
    
    try {
        const walletData = await jettonWallet.getGetWalletData();
        
        console.log('Jetton Wallet Data:');
        console.log('Balance:', walletData.balance.toString());
        console.log('Owner Address:', walletData.owner.toString());
        console.log('Minter Address:', walletData.minter.toString());
        console.log('Code Cell Hash:', walletData.code.hash().toString('hex'));
        
        return walletData;
    } catch (error) {
        console.error('Error getting wallet data. The wallet might not be deployed yet:', error);
        return null;
    }
} 