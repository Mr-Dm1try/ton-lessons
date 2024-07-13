import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TimeAndRandom } from '../wrappers/TimeAndRandom';
import '@ton/test-utils';
import { resolve } from 'path';

describe('TimeAndRandom', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let timeAndRandom: SandboxContract<TimeAndRandom>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        timeAndRandom = blockchain.openContract(await TimeAndRandom.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await timeAndRandom.send(
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
            to: timeAndRandom.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and timeAndRandom are ready to use
    });

    it('should wait 10s', async () => {
        await timeAndRandom.send(
            deployer.getSender(), 
            {value: toNano("0.2")},
            '1s'
        )

        await sleep(2000)

        await timeAndRandom.send(
            deployer.getSender(), 
            {value: toNano("0.2")},
            '1s'
        )

    }, 20000);

    it('should random', async () => {
        console.log("Random - ", await timeAndRandom.getRand())
        console.log("Random from 1 to 100 - ", await timeAndRandom.getRandomBetween(1n, 100n))
        console.log("Unix Time - ", await timeAndRandom.getUnixTime())
    });
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
