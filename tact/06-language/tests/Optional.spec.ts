import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Optional } from '../wrappers/Optional';
import '@ton/test-utils';

describe('Optional', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let optional: SandboxContract<Optional>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        optional = blockchain.openContract(await Optional.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await optional.send(
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
            to: optional.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and optional are ready to use
    });
});
