import { Cell, toNano } from "@ton/core"
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"
import { hex } from "../build/main.compiled.json"
import { MainContract } from "../wrappers/MainContract"

import "@ton/test-utils"

describe('main.fc contract tests', () => {
    let blockchain: Blockchain
    let contract: SandboxContract<MainContract>
    let senderWallet: SandboxContract<TreasuryContract>

    beforeEach(async () => {

        const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0]
        blockchain = await Blockchain.create()

        contract = blockchain.openContract(
            MainContract.createFromConfig({}, codeCell)
        )

        senderWallet = await blockchain.treasury("sender")
    })


    it("should get proper recent sender address", async () => {

        const message = await contract.sendInternalMessage(senderWallet.getSender(), toNano("0.05"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        const data = await contract.getData()
        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString())
    })

    it("should get total", async () => {
        let value = 5;

        await contract.sendInternalMessage(
            senderWallet.getSender(),
            toNano("0.05"),
            value
        )

        let total = await contract.getTotal()
        expect(total).toEqual(value)

        await contract.sendInternalMessage(
            senderWallet.getSender(),
            toNano("0.05"),
            value
        )

        total = await contract.getTotal()
        expect(total).toEqual(value * 2)
    })
})