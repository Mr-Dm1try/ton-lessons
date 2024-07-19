import { Cell, fromNano, toNano } from "@ton/core"
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
                address: senderWallet.address,
                ownerAddress: senderWallet.address
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
        expect(data.recentSender.toString()).toBe(senderWallet.address.toString())
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

    it("should deposit funds", async () => {
        const message = await contract.sendFunds(senderWallet.getSender(), toNano("3.01"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        const balance = await contract.getBalance()
        expect(balance).toBeGreaterThan(toNano("3"))
    })

    it("should bounce funds when no comand is sent", async () => {
        const message = await contract.sendWithoutBody(senderWallet.getSender(), toNano("3.01"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: false
        })

        const balance = await contract.getBalance()
        expect(balance).toEqual(0)
    })

    it("should withdraw funds to owner", async () => {
        const message = await contract.sendFunds(senderWallet.getSender(), toNano("3.01"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        const withdrawMessage = await contract.sendWithdrawRequest(senderWallet.getSender(), toNano("0.01"), toNano("2"))
        expect(withdrawMessage.transactions).toHaveTransaction({
            from: contract.address,
            to: senderWallet.address,
            success: true,
            value: toNano(2)
        })

        const balance = await contract.getBalance()
        expect(balance).toBeLessThan(toNano("1.02"))
    })

    it("should fail to withdraw on behalf of non-owner", async () => {
        const message = await contract.sendFunds(senderWallet.getSender(), toNano("3.01"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        let nonOwnerWallet = await blockchain.treasury("nonOwner")
        const withdrawMessage = await contract.sendWithdrawRequest(nonOwnerWallet.getSender(), toNano("0.01"), toNano("2"))
        expect(withdrawMessage.transactions).toHaveTransaction({
            from: nonOwnerWallet.address,
            to: contract.address,
            success: false,
            exitCode: 103
        })

        const balance = await contract.getBalance()
        expect(balance).toBeGreaterThan(toNano("3"))
    })

    it("should fail to withdraw because lack of balance ", async () => {
        const message = await contract.sendFunds(senderWallet.getSender(), toNano("3.01"))
        expect(message.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: true
        })

        const withdrawMessage = await contract.sendWithdrawRequest(senderWallet.getSender(), toNano("0.01"), toNano("4"))
        expect(withdrawMessage.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: contract.address,
            success: false,
            exitCode: 104
        })

        const balance = await contract.getBalance()
        expect(balance).toBeGreaterThan(toNano("3"))
    })

})