import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import '@ton/test-utils';
import { NftItem } from '../wrappers/NftItem';

describe('NftCollection', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftCollection: SandboxContract<NftCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftCollection = blockchain.openContract(await NftCollection.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftCollection.send(
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
            to: nftCollection.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftCollection are ready to use
    });

    it('should mint', async () => {
        let result = await nftCollection.send(
            deployer.getSender(),
            { value: toNano("0.3") },
            "mint"
        )
        // console.log("mint result - ", result);

        const zeroItemAddress = await nftCollection.getNftItemAddress(0n);
        const item: SandboxContract<NftItem> = blockchain.openContract(NftItem.fromAddress(zeroItemAddress));
    
        let itemData = await item.getItemData()
        console.log("item - ", itemData)
        console.log("content - ", itemData.content.beginParse().loadStringTail())
        console.log("owner - ", itemData.owner)
    
        const user = await blockchain.treasury("user");

        await item.send(
            deployer.getSender(), 
            { value: toNano("0.02") },
            {
                $$type: "Transfer",
                newOwner: user.address,
                queryId: 0n
            }
        )

        itemData = await item.getItemData()
        console.log("new owner - ", itemData.owner)

    });
});
