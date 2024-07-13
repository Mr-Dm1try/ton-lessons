import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SendTon } from '../wrappers/SendTon';
import '@ton/test-utils';

describe('SendTon', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sendTon: SandboxContract<SendTon>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sendTon = blockchain.openContract(await SendTon.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendTon.address,
            deploy: true,
            success: true,
        });

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("500")
            },
            null
        )
    });

    it('should deploy and receive Ton', async () => {
        const balance = await sendTon.getBalance()
        console.log("Balance: ", balance)
    });

    it('should not withdraw to user', async () => {
        const user = await blockchain.treasury('user');
        const balanceBefore = await sendTon.getBalance()

        await sendTon.send(
            user.getSender(),
            {
                value: toNano("0.2")
            },
            "withdraw all"
        )

        const balanceAfter = await sendTon.getBalance()
        expect(balanceAfter).toEqual(balanceBefore)
    });

    it('should withdraw to owner', async () => {
        const balanceBefore = await sendTon.getBalance()

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("0.2")
            },
            "withdraw all"
        )

        const balanceAfter = await sendTon.getBalance()
        expect(balanceAfter).toBeLessThan(balanceBefore)
    });

    it('should withdraw safe to owner', async () => {
        const balanceBefore = await sendTon.getBalance()

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("0.2")
            },
            "withdraw safe"
        )

        const balanceAfter = await sendTon.getBalance()
        expect(balanceAfter).toBeLessThan(balanceBefore)
        expect(balanceAfter).not.toEqual(0)
    });

    it('should withdraw amount to owner', async () => {
        const balanceBefore = await sendTon.getBalance()

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("0.2")
            },
            {
                $$type: 'Withdraw',
                amount: toNano("100")
            }
        )

        const balanceAfter = await sendTon.getBalance()
        expect(balanceAfter).toEqual(balanceBefore - toNano("100"))
        expect(balanceAfter).not.toEqual(0)
    });

});
