import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftItemEditableConfig = {};

export function nftItemEditableConfigToCell(config: NftItemEditableConfig): Cell {
    return beginCell().endCell();
}

export class NftItemEditable implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftItemEditable(address);
    }

    static createFromConfig(config: NftItemEditableConfig, code: Cell, workchain = 0) {
        const data = nftItemEditableConfigToCell(config);
        const init = { code, data };
        return new NftItemEditable(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
