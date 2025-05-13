import { Address, beginCell, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider,args:String[]) {
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    const recipientAddress = Address.parse(args[0] as string);
    const amount = toNano(args[1] as string);
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
            receiver: recipientAddress,
            tonAmount: totalAmount,
            mintMessage: {
                $$type: 'JettonTransferInternal',
                queryId: 0n,
                amount: amount,
                sender: JETTON_MINTER_ADDRESS,
                responseDestination: provider.sender().address!,
                forwardTonAmount: forwardAmount,
                forwardPayload: beginCell().storeUint(0,8).endCell().asSlice()
            }
        }
    );

    console.log('Mint transaction sent successfully!');
} 