import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftCollectionEditableConfig = {};

export function nftCollectionEditableConfigToCell(config: NftCollectionEditableConfig): Cell {
    return beginCell().endCell();
}

export class NftCollectionEditable implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftCollectionEditable(address);
    }

    static createFromConfig(config: NftCollectionEditableConfig, code: Cell, workchain = 0) {
        const data = nftCollectionEditableConfigToCell(config);
        const init = { code, data };
        return new NftCollectionEditable(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
