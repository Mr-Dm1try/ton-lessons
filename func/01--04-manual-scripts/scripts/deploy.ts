import { beginCell, Cell, contractAddress, fromNano, StateInit, storeStateInit, toNano } from "@ton/core";
import { hex } from "../build/main.compiled.json"
import qs from "qs";
import qrcode from "qrcode-terminal"


async function deployScript() {

    console.log("==================================================================")
    console.log("Deploy script is running, let's depoloy our main.fc contract...")
    const code = Cell.fromBoc(Buffer.from(hex, "hex"))[0]
    const data = new Cell()

    const stateInit: StateInit = {
        code: code,
        data: data
    }

    const stateInitBuilder = beginCell()
    storeStateInit(stateInit)(stateInitBuilder)
    const stateInitCell = stateInitBuilder.endCell()

    const address = contractAddress(0, stateInit)

    console.log("The address of the contract is", address.toString())
    console.log("Please scan the QR-code below to deploy the contract:")

    let link = 
        `ton://transfer/`
        + address.toString({testOnly: true})
        + '?'
        + qs.stringify({
            text: "Deploy contract",
            amount: toNano("0.01"),
            init: stateInitCell.toBoc({idx: false}).toString("base64")
        })

    qrcode.generate(link, {small: true}, code => {
        console.log(code)
    })

}

deployScript()