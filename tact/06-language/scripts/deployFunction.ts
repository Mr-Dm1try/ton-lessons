import { toNano } from '@ton/core';
import { Function } from '../wrappers/Function';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const function = provider.open(await Function.fromInit());

    await function.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(function.address);

    // run methods on `function`
}
