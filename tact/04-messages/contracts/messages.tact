import "@stdlib/deploy";

message Add {
    amount: Int as uint32;
}

message CounterValue {
    value: Int as uint32;
}

contract Messages with Deployable {
    id: Int as uint32;
    counter: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    // step 4
    receive("increment") {
        self.counter += 1;
        self.reply(CounterValue{value: self.counter}.toCell());
    }

    // step 2
    receive("query") {
        self.reply(CounterValue{value: self.counter}.toCell());
    }

    receive(msg: Add) {
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    // if none of the previous receivers match the comment string, this one is called
    receive(message: String) {
    }

    //unknown message type
    receive(message: Slice) {
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}
