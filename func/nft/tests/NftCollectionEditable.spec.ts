import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftCollectionEditable } from '../wrappers/NftCollectionEditable';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftCollectionEditable', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftCollectionEditable');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftCollectionEditable: SandboxContract<NftCollectionEditable>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftCollectionEditable = blockchain.openContract(NftCollectionEditable.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftCollectionEditable.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftCollectionEditable.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftCollectionEditable are ready to use
    });
});
