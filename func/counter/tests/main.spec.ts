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
        senderWallet = await blockchain.treasury("sender")

        contract = blockchain.openContract(
            MainContract.createFromConfig({
                number: 0,
                address: senderWallet.address
            }, codeCell)
        )

    })


    it("should get proper recent sender address and incremented counter", async () => {

        const message = await contract.sendIncrement(senderWallet.getSender(), toNano("0.05"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        const data = await contract.getData()
        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString())
        expect(data.counter).toEqual(1)
    })

    it("should increment counter by 5", async () => {

        const message = await contract.sendIncrement(senderWallet.getSender(), toNano("0.05"), 5)
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        const data = await contract.getData()
        expect(data.counter).toEqual(5)
    })

})