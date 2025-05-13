import { Address, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider,args:String[]) {
    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    const newOwner = args[0];

    await jettonMinter.send(
        provider.sender(),
        {
            value: toNano('0.01')
        },
        {
            $$type: 'ChangeOwner',
            queryId: 0n,
            newOwner: Address.parse(newOwner as string)
        }
    );

    console.log('Owner change transaction sent successfully!');
} 