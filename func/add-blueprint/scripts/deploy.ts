import { NetworkProvider, compile } from "@ton/blueprint";
import { MainContract } from "../wrappers/MainContract";
import { address, toNano } from "@ton/core";


export async function run(provider: NetworkProvider) {
    const myContract = MainContract.createFromConfig(
        {
            number: 0,
            address: address("0QBVy-ndD9logBtdp7nHKZoztIOrDrY9V8OA0SA5gdKldNcn"),
            ownerAddress: address("0QBVy-ndD9logBtdp7nHKZoztIOrDrY9V8OA0SA5gdKldNcn")
        },
        await compile("MainContract")
    )

    const openedContract = provider.open(myContract)

    openedContract.sendDeploy(provider.sender(), toNano("0.05"))

    await provider.waitForDeploy(myContract.address)
}