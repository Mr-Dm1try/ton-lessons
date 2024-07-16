import { Address, beginCell, Cell, Contract, ContractABI, contractAddress, ContractProvider, Sender, SendMode, StateInit } from "@ton/core";
import { Maybe } from "@ton/core/dist/utils/maybe";


export class MainContract implements Contract {

    // address: Address;
    // init?: Maybe<StateInit>;
    // abi?: Maybe<ContractABI>;

    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell }
    ) {}

    static createFromConfig(config: any, code: Cell, workchain = 0) {
        const data = beginCell().endCell()
        const init = { code, data }
        const address = contractAddress(workchain, init)

        return new MainContract(address, init)
    }

    async sendInternalMessage(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        data: number = 0
    ) {
        await provider.internal(
            sender,
            {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().storeUint(data, 32).endCell()
            }
        )
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_the_latest_sender", [])
        return {
            recent_sender: stack.readAddress()
        }
    }

    async getTotal(provider: ContractProvider) {
        const { stack } = await provider.get("get_total", [])
        return stack.readNumber()
    }
}
