import { Address, contractAddress, OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { useEffect, useState } from "react";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { MainContract } from "../contracts/MainContract";


export function useMainContract() {
    const client = useTonClient()
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
        }
        getValue()
    }, [mainContract])

    return {
        contractAddress: mainContract?.address.toString(),
        contractBalance: balance,
        ...contractData
    }
}