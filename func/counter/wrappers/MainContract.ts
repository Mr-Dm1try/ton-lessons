import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type MainContractConfig = {
    number: number;
    address: Address;
    ownerAddress: Address;
}

export function mainConfigToCell(config: MainContractConfig): Cell {
    return beginCell()
        .storeUint(config.number, 32)
        .storeAddress(config.address)
        .storeAddress(config.ownerAddress)
        .endCell()
}
 
export class MainContract implements Contract {

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

    async sendFunds(
        provider: ContractProvider,
        sender: Sender,
        value: bigint
    ) {
        await provider.internal(
            sender,
            {
                value: value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().storeUint(2, 32).endCell()
            }
        )
    }

    async sendWithdrawRequest(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        amount: bigint
    ) {
        await provider.internal(
            sender,
            {
                value: value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().storeUint(3, 32).storeCoins(amount).endCell()
            }
        )
    }

    async sendWithoutBody(
        provider: ContractProvider,
        sender: Sender,
        value: bigint
    ) {
        await provider.internal(
            sender,
            {
                value: value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().endCell()
            }
        )
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_storage", [])
        return {
            counter: stack.readNumber(),
            recentSender: stack.readAddress(),
            ownerAddress: stack.readAddress()
        }
    }

    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get("balance", [])
        return stack.readNumber()
    }
}
