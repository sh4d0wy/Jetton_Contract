import { beginCell, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_CONTENT_URI, JETTON_MINTER_ADDRESS } from '../config';

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
    
    const amount = toNano('1000000000');
    const forwardAmount = toNano('0.1');
    const totalAmount = toNano('0.1');
    const jettonMinter = provider.open(await JettonMinter.fromInit(0n, senderAddress, cell,true));

    await jettonMinter.send(
        provider.sender(),
        {
            value: totalAmount+toNano('0.05'),
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
                sender: jettonMinter.address!,
                responseDestination: jettonMinter.address!,
                forwardTonAmount: forwardAmount,
                forwardPayload: beginCell().storeUint(0,8).endCell().asSlice()
            }
        }
    );

    await provider.waitForDeploy(jettonMinter.address);

}
