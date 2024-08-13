import { toNano } from '@ton/core';
import { NftCollectionEditable } from '../wrappers/NftCollectionEditable';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftCollectionEditable = provider.open(NftCollectionEditable.createFromConfig({}, await compile('NftCollectionEditable')));

    await nftCollectionEditable.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftCollectionEditable.address);

    // run methods on `nftCollectionEditable`
}
