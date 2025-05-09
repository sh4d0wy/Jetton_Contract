import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider) {
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    
    const jettonData = await jettonMinter.getGetJettonData();
    
    console.log('Jetton Data:');
    console.log('Total Supply:', jettonData.totalSupply.toString());
    console.log('Mintable:', jettonData.mintable);
    console.log('Admin Address:', jettonData.adminAddress.toString());
    console.log('Jetton Content Cell Hash:', jettonData.jettonContent.hash().toString('hex'));
    console.log('Jetton Wallet Code Cell Hash:', jettonData.jettonWalletCode.hash().toString('hex'));
    
    return jettonData;
} 