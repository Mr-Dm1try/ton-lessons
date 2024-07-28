import { Address, OpenedContract, toNano } from "@ton/core";
import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export function useMainContract() {
    const client = useTonClient()
    const { sender } = useTonConnect()

    const [contractData, setContractData] = useState<null | {
        counter: number,
        recentSender: Address,
        ownerAddress: Address,
    }>()

    const [balance, setBalance] = useState<null | number>(0)

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return

        const contract = new MainContract(Address.parse('EQAf0pL8wWg1HVfjgL_urrZQnBKhgkyuohkRO_KRzIQkync2'))
        return client.open(contract) as OpenedContract<MainContract>
    }, [client])

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return 

            setContractData(null)
            const val = await mainContract.getData()
            const balance = await mainContract.getBalance()
            setContractData({
                counter: val.counter,
                recentSender: val.recentSender,
                ownerAddress: val.ownerAddress
            })
            setBalance(balance) 
            await sleep(5000)
            getValue()
        }
        getValue()
    }, [mainContract])

    return {
        contractAddress: mainContract?.address.toString(),
        contractBalance: balance,
        ...contractData,
        sendIncrement: async() => {
            return mainContract?.sendIncrement(sender, toNano("0.01"), 3)
        },
        sendDeposit: async() => {
            return mainContract?.sendFunds(sender, toNano('1'))
        },
        sendWithdrawal: async() => {
            return mainContract?.sendWithdrawRequest(sender, toNano('0.01'), toNano('0.1'))
        }
    }
}