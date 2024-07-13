import "@stdlib/deploy";
import "./messages";
import "./jetton_wallet";

struct Metadata {
    symbol: String;
    totalSupply: Int;
}

contract JettonMaster with Deployable, Ownable {

    owner: Address;
    symbol: String = "TON";
    totalSupply: Int as coins = ton("500"); 

    init() {
        self.owner = sender();
        self.mint(self.totalSupply, sender());
    }

    receive(msg: Mint) {
        self.requireOwner();
        self.mint(msg.amount, self.owner);
        self.totalSupply += msg.amount;
    }

    fun mint(amount: Int, to: Address) {
        let init: StateInit = initOf JettonWallet(myAddress(), to);

        send(SendParameters{
            to: contractAddress(init),
            body: InternalAdd{
                amount: amount,
                origin: myAddress()
            }.toCell(),
            value: ton("0.03"),
            mode: SendIgnoreErrors,
            code: init.code,
            data: init.data
        });
    }

    get fun walletAddress(owner: Address): Address {
        let init: StateInit = initOf JettonWallet(myAddress() , owner);
        return contractAddress(init);
    }

    get fun metadata(): Metadata {
        return Metadata{symbol: self.symbol, totalSupply: self.totalSupply};
    }
}
