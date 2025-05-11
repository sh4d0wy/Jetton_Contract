import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider, args: string[]) {
    if (args.length < 2) {
        throw new Error("Usage: transferJetton <destination_address> <amount> [forward_ton_amount]");
    }
    
    const destinationAddress = Address.parse(args[0]);
    const amount = toNano(args[1]);
    const forwardTonAmount = args[2] ? toNano(args[2]) : toNano('0.05');
    
    const senderAddress = await provider.sender().address;
    if (!senderAddress) {
        throw new Error("Sender address is not defined");
    }
    
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    const walletAddress = await jettonMinter.getGetWalletAddress(senderAddress);
    
    console.log('Your Jetton Wallet Address:', walletAddress.toString());
    console.log('Sending', amount.toString(), 'tokens to', destinationAddress.toString());
    
    const jettonWallet = provider.open(new JettonWallet(walletAddress));
    
    const transferFee = toNano('0.05');
    
    const result = await jettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.1')
        },
        {
            $$type: 'JettonTransfer',
            queryId: 1n,
            amount: amount,
            destination: destinationAddress,
            responseDestination: senderAddress,
            customPayload: null,
            forwardTonAmount: forwardTonAmount,
            forwardPayload: beginCell().storeUint(0, 8).endCell().asSlice()
        }
    );
    
    console.log('Transfer sent successfully!');
    
    return result;
} 