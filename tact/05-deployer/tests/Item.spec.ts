import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Item2 } from '../build/Item/tact_Item2';
import { Item } from '../wrappers/Item';
import { Item3 } from '../build/Item/tact_Item3';

describe('Item', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let item: SandboxContract<Item>;
    let item2: SandboxContract<Item2>;
    let item3: SandboxContract<Item3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        item = blockchain.openContract(await Item.fromInit());
        item2 = blockchain.openContract(await Item2.fromInit());
        item3 = blockchain.openContract(await Item3.fromInit(1n)); 

        deployer = await blockchain.treasury('deployer');

        const deployResult = await item.send(
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
            to: item.address,
            deploy: true,
            success: true,
        });

        const deployResult2 = await item2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult2.transactions).toHaveTransaction({
            from: deployer.address,
            to: item2.address,
            deploy: true,
            success: true,
        });

        const deployResult3 = await item3.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult3.transactions).toHaveTransaction({
            from: deployer.address,
            to: item3.address, 
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and item are ready to use
    });

    it('should return addresses', async () => {
        const firstAddress = await item.getAddress();
        const secondAddress = await item2.getAddress();

        const firstOtherAddress = await item2.getOtherAddress();
        const secondOtherAddress = await item .getOtherAddress();

        expect(firstAddress.toString()).toEqual(firstOtherAddress.toString())
        expect(secondAddress.toString()).toEqual(secondOtherAddress.toString())
    });

    it('should deply new contract ', async () => {
        const notExistAddress = await item3.getOtherAddress(14n);

        await item3.send(
            deployer.getSender(),
            { value: toNano("0.2") },
            {
                $$type: "DeployContract",
                id: 14n
            }
        )

        const newItem = blockchain.openContract(await Item3.fromInit(14n));
        const newItemAddress = await newItem.getAddress();

        expect(newItemAddress.toString()).toEqual(notExistAddress.toString());
    });
});
