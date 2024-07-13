import { toNano } from '@ton/core';
import { Optional } from '../wrappers/Optional';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const optional = provider.open(await Optional.fromInit());

    await optional.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(optional.address);

    // run methods on `optional`
}
