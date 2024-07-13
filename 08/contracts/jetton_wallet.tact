import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

struct WalletData {
    owner: Address;
    balance: Int;
}

contract JettonWallet with Deployable, Ownable {
    parent: Address;
    owner: Address;
    balance: Int as coins = 0;

    init(parent: Address, owner: Address) {
        self.parent = parent;
        self.owner = owner;
    }

    receive(msg: InternalAdd) {
        if(msg.origin == self.parent) {
            require(sender() == self.parent, "Parent only");
        } else {
            let init: StateInit = initOf JettonWallet(self.parent, msg.origin);
            require(sender() == contractAddress(init), "JW only");
        }

        self.balance += msg.amount;
    }

    receive(msg: Transfer) {
        self.requireOwner();
        require(self.balance >= msg.amount, "Insufficient balance");

        self.balance -= msg.amount;

        let init: StateInit = initOf JettonWallet(self.parent, msg.to);
        send(SendParameters{
            to: contractAddress(init),
            body: InternalAdd{
                amount: msg.amount,
                origin: self.owner
            }.toCell(),
            value: ton("0.03"),
            mode: SendIgnoreErrors,
            code: init.code,
            data: init.data
        });

        self.reply("Transferred".asComment());
    }

    get fun walletData(): WalletData {
        return WalletData{
            balance: self.balance,
            owner: self.owner
        }
    }
}
