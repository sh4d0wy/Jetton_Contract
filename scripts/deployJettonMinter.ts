import { beginCell, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_CONTENT_URI } from '../config';

export async function run(provider: NetworkProvider) {
    const senderAddress = await provider.sender().address;
    if(!senderAddress) {
        throw new Error("Sender address is not defined");
    }

    const content = {
        type:1,
        uri:JETTON_CONTENT_URI
    }
    const cell = beginCell()
            .storeUint(content.type, 8)
            .storeStringTail(content.uri) 
            .endCell()
    
    
    const jettonMinter = provider.open(await JettonMinter.fromInit(100000000n, senderAddress, cell,true));

    await jettonMinter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(jettonMinter.address);

    // run methods on `jettonMinter`
}
