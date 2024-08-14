import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftItemEditable } from '../wrappers/NftItemEditable';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftItemEditable', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftItemEditable');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftItemEditable: SandboxContract<NftItemEditable>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftItemEditable = blockchain.openContract(NftItemEditable.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftItemEditable.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftItemEditable.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftItemEditable are ready to use
    });
});
