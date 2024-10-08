import "@stdlib/deploy";

message Deposit {
    amount: Int as uint32;
}

message Withdraw {
    amount: Int as uint32;
    target: Address;
}

contract Fund with Deployable {

    balance: Int as uint256 = 10;

    receive() {
        throw(111);
    }

    receive(msg: Deposit) {
        self.balance += msg.amount;
    }

    receive(msg: Withdraw) {
        require(self.balance >= msg.amount, "Not enough money");

        self.balance -= msg.amount;

        send(SendParameters{
            to: msg.target,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Deposit{amount: msg.amount}.toCell()
        });
    }

    bounced(src: Deposit) {
        self.balance += src.amount;
    }

    get fun balance(): Int {
        return self.balance;
    }
}
