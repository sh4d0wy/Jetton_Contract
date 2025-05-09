import { beginCell, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_CONTENT_URI, JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider) {
    const content = {
        type: 1,
        uri: JETTON_CONTENT_URI
    };
    
    const contentCell = beginCell()
        .storeUint(content.type, 8)
        .storeStringTail(content.uri)
        .endCell();

    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    
    await jettonMinter.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'JettonUpdateContent',
            queryId: 1n,
            content: contentCell
        }
    );

    console.log('Jetton content update transaction sent successfully!');
} 