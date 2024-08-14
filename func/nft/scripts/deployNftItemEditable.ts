import { toNano } from '@ton/core';
import { NftItemEditable } from '../wrappers/NftItemEditable';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftItemEditable = provider.open(NftItemEditable.createFromConfig({}, await compile('NftItemEditable')));

    await nftItemEditable.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftItemEditable.address);

    // run methods on `nftItemEditable`
}
