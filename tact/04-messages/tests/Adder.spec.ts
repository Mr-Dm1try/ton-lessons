import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Adder } from '../wrappers/Adder';
import { Messages } from '../wrappers/Messages';

describe('Adder and Messages', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let adder: SandboxContract<Adder>;
    let messages: SandboxContract<Messages>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        adder = blockchain.openContract(await Adder.fromInit());
        messages = blockchain.openContract(await Messages.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResultAdder = await adder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResultMessages = await messages.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResultAdder.transactions).toHaveTransaction({
            from: deployer.address,
            to: adder.address,
            deploy: true,
            success: true,
        });

        expect(deployResultMessages.transactions).toHaveTransaction({
            from: deployer.address,
            to: messages.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and adder are ready to use
    });

    it('should increase to target', async () => {
        const target = 6n
        const result = await adder.send(deployer.getSender(),
            { value: toNano("0.2") },
            { 
                $$type: 'Reach',
                counter: messages.address,
                target
            }
        )

        const counterValue = await messages.getCounter()

        expect(counterValue).toEqual(target)
        
        // console.log(result)
    });
});
