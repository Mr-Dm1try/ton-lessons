import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Company } from '../wrappers/Company';
import { Fund } from '../wrappers/Fund';

describe('Company and Fund', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let company: SandboxContract<Company>;
    let fund: SandboxContract<Fund>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        company = blockchain.openContract(await Company.fromInit());
        fund = blockchain.openContract(await Fund.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResultCompany = await company.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResultCompany.transactions).toHaveTransaction({
            from: deployer.address,
            to: company.address,
            deploy: true,
            success: true,
        });

        const deployResultFund = await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResultFund.transactions).toHaveTransaction({
            from: deployer.address,
            to: fund.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and company are ready to use
    });

    it('should withdraw', async () => {
        const withdraw = 3n
        const res = await fund.send(deployer.getSender(),
            { value: toNano("0.2") },
            {
                $$type: "Withdraw",
                amount: withdraw,
                target: company.address
            }
        )
        
        const companyBalance = await company.getBalance()

        expect(companyBalance).toEqual(withdraw)
    });

    it('should bounce', async () => {
        const withdraw = 30n
        const res = await fund.send(deployer.getSender(),
            { value: toNano("0.2") },
            {
                $$type: "Withdraw",
                amount: withdraw,
                target: company.address
            }
        )
        
        const fundBalance = await fund.getBalance()

        expect(fundBalance).toEqual(10n)
    });
});
