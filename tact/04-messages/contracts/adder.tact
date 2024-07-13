import "@stdlib/deploy";

message Reach {
    counter: Address;
    target: Int as uint16;
}

message CounterValue {
    value: Int as uint32;
}

contract Adder with Deployable {

    target: Int as uint16 = 0;

    // step 1
    receive(msg: Reach) {
        // require(msg.target <= 10, "Target can't be bigger than 10")
        if (msg.target > 10) {
            throw(123);
        }

        self.target = msg.target;
        send(SendParameters{
            to: msg.counter,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment()
        });
    }

    // step 3
    receive(msg: CounterValue) {
        if(self.target > msg.value) {
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        }
    }
}
