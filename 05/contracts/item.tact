import "@stdlib/deploy";

contract Item with Deployable {
    id: Int as uint64 = 1;

    get fun address(): Address {
        return myAddress();
    }

    get fun otherAddress(): Address {
        let init: StateInit = initOf Item2();
        return contractAddress(init);
    }
}

contract Item2 with Deployable {
    id: Int as uint64 = 2;

    get fun address(): Address {
        return myAddress();
    }

    get fun otherAddress(): Address {
        let init: StateInit = initOf Item();
        return contractAddress(init);
    }
}

message DeployContract {
    id: Int as uint64;
}

contract Item3 with Deployable {
    id: Int as uint64;

    init(id: Int) {
        self.id = id;
    }

    receive(message: DeployContract) {
        let init: StateInit = initOf Item3(message.id);
        let address: Address = contractAddress(init);

        send(SendParameters{
            to: address,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: true,
            code: init.code,
            data: init.data,
            body: Deploy{
                queryId: 0
            }.toCell()
        });
    }

    get fun address(): Address {
        return myAddress();
    }

    get fun otherAddress(otherId: Int): Address {
        let init: StateInit = initOf Item3(otherId);
        return contractAddress(init);
    }
}