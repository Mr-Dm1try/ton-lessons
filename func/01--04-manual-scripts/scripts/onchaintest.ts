import { Address, Cell, contractAddress, StateInit, toNano } from "@ton/core"
import { hex } from "../build/main.compiled.json"
import { getHttpV4Endpoint } from "@orbs-network/ton-access"
import { TonClient4 } from "@ton/ton"
import qs from "qs"
import qrcode from "qrcode-terminal"


async function onchainTestScript() {
    const code = Cell.fromBoc(Buffer.from(hex, "hex"))[0]
    const data = new Cell()

    const stateInit: StateInit = {
        code: code,
        data: data
    }

    const address = contractAddress(0, stateInit)

    const endpoint = await getHttpV4Endpoint({ network: "testnet" })
    const client = new TonClient4({ endpoint })

    const latestBlock = await client.getLastBlock()
    let status = await client.getAccount(latestBlock.last.seqno, address)

    if (status.account.state.type !== "active") {
        console.log("Contract isn't active!")
        return
    }

    let link = 
        `ton://transfer/`
        + address.toString({testOnly: true})
        + '?'
        + qs.stringify({
            text: "Simple test transaction",
            amount: toNano("0.01"),
        })

    qrcode.generate(link, {small: true}, code => {
        console.log(code)
    })

    let recentSender: Address

    setInterval(async () => {
        const latestBlock = await client.getLastBlock()
        const { exitCode, result } = await client.runMethod(
            latestBlock.last.seqno,
            address,
            "get_the_latest_sender"
        )

        if (exitCode !== 0) {
            console.log("Running getter failed")
            return
        }

        if (result[0].type != "slice") {
            console.log("Unknown result type")
            return
        }

        let mostResentSender = result[0].cell.beginParse().loadAddress()

        if (mostResentSender && mostResentSender.toString() !== recentSender?.toString()) {
            console.log("New sender found:", mostResentSender.toString({testOnly: true}))
            recentSender = mostResentSender
        }
    }, 2000)
}

onchainTestScript()
