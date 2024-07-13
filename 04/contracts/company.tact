import "@stdlib/deploy";

message Deposit {
    amount: Int as uint32;
}

contract Company with Deployable {

    balance: Int as uint256 = 0;

    receive(msg: Deposit) {
        require(msg.amount < 10, "Suspicious amount!");
        self.balance += msg.amount;
    }

    get fun balance(): Int {
        return self.balance;
    }
}
