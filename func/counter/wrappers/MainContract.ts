import { Address, beginCell, Cell, Contract, ContractABI, contractAddress, ContractProvider, Sender, SendMode, StateInit } from "@ton/core";

export type MainContractConfig = {
    number: number;
    address: Address;
}

export function mainConfigToCell(config: MainContractConfig): Cell {
    return beginCell()
        .storeUint(config.number, 32)
        .storeAddress(config.address)
        .endCell()
}

export class MainContract implements Contract {

    // address: Address;
    // init?: Maybe<StateInit>;
    // abi?: Maybe<ContractABI>;

    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell }
    ) {}

    static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) {
        const data = mainConfigToCell(config)
        const init = { code, data }
        const address = contractAddress(workchain, init)

        return new MainContract(address, init)
    }

    async sendIncrement(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        data: number = 1
    ) {
        await provider.internal(
            sender,
            {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().storeUint(1, 32).storeUint(data, 32).endCell()
            }
        )
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_storage", [])
        return {
            counter: stack.readNumber(),
            recent_sender: stack.readAddress()
        }
    }
}
