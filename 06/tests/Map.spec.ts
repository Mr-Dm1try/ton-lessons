import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Dictionary, fromNano } from '@ton/core';
import { Map } from '../wrappers/Map';
import '@ton/test-utils';

describe('Map', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let map: SandboxContract<Map>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const dict = Dictionary.empty(Dictionary.Keys.BigInt(32), Dictionary.Values.Bool())
        dict.set(1n, true)
        map = blockchain.openContract(await Map.fromInit(dict));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await map.send(
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
            to: map.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and map are ready to use
    });

    it('should add map', async () => {
        const gasUsed = []

        for (let index: bigint = 0n; index < 100; index++) {
            const res = await getUsedGas(deployer, async () => {
                await map.send(deployer.getSender(),
                    { value: toNano("0.02") },
                    {
                        $$type: 'Add',
                        key: index,
                        value: index
                    }
                )
            })
            gasUsed.push(res) 
        }

        console.log("gas - ", gasUsed)

        console.log("map - ", (await map.getFullMap()).values)
    
    });
});

async function getUsedGas(sender: SandboxContract<TreasuryContract>, message: any) {
    const balanceBefore = await sender.getBalance()
    await message() 
    return fromNano(balanceBefore - await sender.getBalance())
}