import "@stdlib/deploy";
import "@stdlib/ownable";

trait Stoppable with Ownable {
    owner: Address;
    stopped: Bool; 

    receive("stop") {
        self.requireOwner();

        self.stopped = true; 
        self.reply("stopped".asComment());
    }

    fun requireStopped() {
        require(self.stopped, "Contract not stopped");
    }

    fun requireNotStopped() {
        require(!self.stopped, "Contract stopped");
    }

    get fun stopped(): Bool {
        return self.stopped;
    }
}

trait Resumeable with Stoppable {
    owner: Address;
    stopped: Bool; 

    receive("resume") {
        self.requireOwner();
        self.requireStopped();

        self.stopped = false;
        self.reply("resumed".asComment());
    }
} 

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract StoppableCounter with Deployable, Stoppable {
    id: Int as uint32;
    counter: Int as uint32;
    stopped: Bool = false;
    owner: Address;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
        self.owner = sender(); 
    }

    receive(msg: Add) {
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
}
