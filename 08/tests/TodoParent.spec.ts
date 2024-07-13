import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TodoParent } from '../wrappers/TodoParent';
import { CompleteTodo, NewTodo, TodoChild } from '../wrappers/TodoChild';
import '@ton/test-utils';

describe('TodoParent', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todoParent: SandboxContract<TodoParent>;
    // let todoChild: SandboxContract<TodoChild>; 


    beforeEach(async () => {
        blockchain = await Blockchain.create();

        todoParent = blockchain.openContract(await TodoParent.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await todoParent.send(
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
            to: todoParent.address,
            deploy: true,
            success: true,
        });



        // const deployResult = await todoChild.send(
        //     deployer.getSender(),
        //     {
        //         value: toNano('0.05'),
        //     },
        //     {
        //         $$type: 'Deploy',
        //         queryId: 0n,
        //     }
        // );

        // expect(deployResult.transactions).toHaveTransaction({
        //     from: deployer.address,
        //     to: todoChild.address,
        //     deploy: true,
        //     success: true,
        // });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and todoParent are ready to use
    });

    it('should create TODO', async () => {
        const msg: NewTodo = {
            $$type: 'NewTodo',
            task: 'tododo'
        }

        await todoParent.send( 
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            msg
        )

        const todoChildAddress = await todoParent.getTodoAddress(1n);

        const todoChild = blockchain.openContract(TodoChild.fromAddress(todoChildAddress));
        
        let details = await todoChild.getDetails()
        console.log('details - ', details)

        const complete: CompleteTodo = {
            $$type: 'CompleteTodo',
            seqno: 1n
        }

        await todoParent.send( 
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            complete
        )

        details = await todoChild.getDetails()
        console.log('details - ', details)
    }); 
});
