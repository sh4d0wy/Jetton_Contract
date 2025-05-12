import { toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';
import { buildTokenMetadataCell } from '../utils/metadataCreator';

type Metadata = {
    name: string;
    description: string;
    symbol: string;
    decimals: string;
    image: string;
}
export async function run(provider: NetworkProvider,args:String[]) {
    let metadata: Metadata = {
        name: "TestTokenDigiTon",
        description: "This is a test token on the TON network",
        symbol: "TTDTN",
        decimals: "9",
        image: "https://olive-fashionable-mule-815.mypinata.cloud/ipfs/bafkreidb4qrsfsbb6esz4fmvgz4tu4vvb7krsqhpedgxcz2xglw2xaqbnu"
    };
    const key = args[0] as keyof Metadata;
    const value = args[1] as string;

    if (args.length > 0) {
        metadata[key as keyof Metadata] = value;
    }
    console.log(metadata);

    const content = await buildTokenMetadataCell(metadata);

    const jettonMinter = provider.open(new JettonMinter(JETTON_MINTER_ADDRESS));
    
    await jettonMinter.send(
        provider.sender(),
        {
            value: toNano('0.01'),
        },
        {
            $$type: 'JettonUpdateContent',
            queryId: 1n,
            content: content
        }
    );

    console.log('Jetton content update transaction sent successfully!');
} 