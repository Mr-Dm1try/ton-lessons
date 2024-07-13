import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Function } from '../wrappers/Function';
import '@ton/test-utils';

describe('Function', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let function1: SandboxContract<Function>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        function1 = blockchain.openContract(await Function.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await function1.send(
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
            to: function1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and function are ready to use
    });
});
