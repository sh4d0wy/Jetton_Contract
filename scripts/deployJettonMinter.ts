import { beginCell, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { buildTokenMetadataCell } from '../utils/metadataCreator';

export async function run(provider: NetworkProvider) {
    const senderAddress = await provider.sender().address;
    if(!senderAddress) {
        throw new Error("Sender address is not defined");
    }

    // Create onchain metadata
    const metadata = {
        name: "TestTokenDigiTon",
        description: "This is a test token on the TON network",
        symbol: "TTDTN1",
        decimals: "9",
        image: "https://olive-fashionable-mule-815.mypinata.cloud/ipfs/bafkreidb4qrsfsbb6esz4fmvgz4tu4vvb7krsqhpedgxcz2xglw2xaqbnu"
    };

    // Create a cell containing the metadata using the proper format
    const content = await buildTokenMetadataCell(metadata);
    
    const amount = toNano('1000000000');
    const forwardAmount = toNano('0.01');
    const totalAmount = toNano('0.05');
    const jettonMinter = provider.open(await JettonMinter.fromInit(0n, senderAddress, content, true));

    await jettonMinter.send(
        provider.sender(),
        {
            value: totalAmount+forwardAmount,
        },
        {
            $$type: 'Mint',
            queryId: 1n,
            receiver: provider.sender().address!,
            tonAmount: totalAmount,
            mintMessage: {
                $$type: 'JettonTransferInternal',
                queryId: 0n,
                amount: amount,
                sender: jettonMinter.address!,
                responseDestination: provider.sender().address!,
                forwardTonAmount: forwardAmount,
                forwardPayload: beginCell().storeUint(0,8).endCell().asSlice()
            }
        }
    );

    await provider.waitForDeploy(jettonMinter.address);
}
