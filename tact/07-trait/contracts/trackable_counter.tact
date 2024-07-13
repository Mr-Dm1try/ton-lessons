import "@stdlib/deploy";
import "@stdlib/ownable";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

trait Trackable with Ownable  {
    messagesReceived: Int;
    owner: Address;

    virtual const ENABLE_RESET: Bool = true;

    receive("reset") {
        if (self.ENABLE_RESET) {
            self.requireOwner();
            self.messagesReceived = 0;
            self.reply("is reseted".asComment());
        }
    }

    fun receiveNewMsg() {
        if (self.filterMessage()) {
            self.messagesReceived += 1;
        }
    }

    get fun stat(): Int {
        return self.messagesReceived;
    }

    virtual fun filterMessage(): Bool {
        return self.owner != sender();
    }
}

contract TrackableCounter with Deployable, Trackable {
    id: Int as uint32;
    counter: Int as uint32 = 0;
    messagesReceived: Int = 0;
    owner: Address;

    override const ENABLE_RESET: Bool = false;

    init(id: Int) {
        self.id = id;
        self.owner = sender();
    }

    receive(msg: Add) {
        self.receiveNewMsg();

        self.counter += msg.amount;
 
        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

    override fun filterMessage(): Bool {
        return true;
    }
}
