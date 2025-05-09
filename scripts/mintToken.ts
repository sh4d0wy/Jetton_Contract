import { beginCell, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider) {
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    
    const amount = toNano('1000');
    const forwardAmount = toNano('0.1');
    const totalAmount = toNano('0.5');

    await jettonMinter.send(
        provider.sender(),
        {
            value: totalAmount + toNano('0.1')
        },
        {
            $$type: 'Mint',
            queryId: 0n,
            receiver: provider.sender().address!,
            tonAmount: totalAmount,
            mintMessage: {
                $$type: 'JettonTransferInternal',
                queryId: 0n,
                amount: amount,
                sender: JETTON_MINTER_ADDRESS,
                responseDestination: JETTON_MINTER_ADDRESS,
                forwardTonAmount: forwardAmount,
                forwardPayload: beginCell().storeUint(0,8).endCell().asSlice()
            }
        }
    );

    console.log('Mint transaction sent successfully!');
} 