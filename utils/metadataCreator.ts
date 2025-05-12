import { beginCell, Cell, Dictionary } from '@ton/core';
import { sha256 } from '@ton/crypto';

const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

type JettonMetaDataKeys = "name" | "description" | "image" | "symbol" | "decimals";

const jettonOnChainMetadataSpec: {
    [key in JettonMetaDataKeys]: "utf8" | "ascii" | undefined;
} = {
    name: "utf8",
    description: "utf8",
    image: "ascii",
    symbol: "utf8",
    decimals: "utf8",
};

export async function buildTokenMetadataCell(data: { [s: string]: string | undefined }): Promise<Cell> {
    const KEYLEN = 256;
    const dict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell());

    for (const [k, v] of Object.entries(data)) {
        if (!jettonOnChainMetadataSpec[k as JettonMetaDataKeys])
            throw new Error(`Unsupported onchain key: ${k}`);
        if (v === undefined || v === "") continue;

        let bufferToStore = Buffer.from(v, jettonOnChainMetadataSpec[k as JettonMetaDataKeys]);

        const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

        const rootCell = beginCell()
            .storeUint(SNAKE_PREFIX, 8);
        let currentCell = rootCell;

        while (bufferToStore.length > 0) {
            currentCell = currentCell.storeBuffer(bufferToStore.slice(0, CELL_MAX_SIZE_BYTES));
            bufferToStore = bufferToStore.slice(CELL_MAX_SIZE_BYTES);
            if (bufferToStore.length > 0) {
                const newCell = beginCell();
                currentCell.storeRef(newCell);
                currentCell = newCell;
            }
        }

        const keyHash = await sha256(k);
        dict.set(keyHash, rootCell.endCell());
    }

    return beginCell().storeUint(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell();
}
