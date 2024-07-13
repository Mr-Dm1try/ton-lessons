import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Loops } from '../wrappers/Loops';
import '@ton/test-utils';

describe('Loops', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let loops: SandboxContract<Loops>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        loops = blockchain.openContract(await Loops.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await loops.send(
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
            to: loops.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and loops are ready to use
    });

    it('should show result', async () => {
        await loops.send(deployer.getSender(), {value: toNano("0.02")}, "repeat")
        await loops.send(deployer.getSender(), {value: toNano("0.02")}, "while")
        await loops.send(deployer.getSender(), {value: toNano("0.02")}, "until")
    });
});
