import { toNano } from '@ton/core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider } from '@ton/blueprint';
import { JETTON_MINTER_ADDRESS } from '../config';

export async function run(provider: NetworkProvider) {
    const senderAddress = await provider.sender().address;
    if(!senderAddress) {
        throw new Error("Sender address is not defined");
    }

    //TODO: add minter address
    const jettonWallet = provider.open(await JettonWallet.fromInit(0n,senderAddress,JETTON_MINTER_ADDRESS));

    await jettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(jettonWallet.address);

    // run methods on `jettonWallet`
}
