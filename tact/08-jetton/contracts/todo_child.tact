import "@stdlib/deploy";
import "./messages";

struct TodoDetails {
    task: String;
    completed: Bool;
}

contract TodoChild with Deployable {
    parent: Address;
    seqno: Int as uint256;
    task: String = "";
    completed: Bool = false; 

    init(parent: Address, seqno: Int) {
        self.parent = parent;
        self.seqno = seqno;
    }

    receive(msg: InternalSetTask) {
        require(sender() == self.parent, "Parent only");
        self.task = msg.task;
    }

    receive(msg: InternalComplete) {
        require(sender() == self.parent, "Parent only");
        self.completed = true;

        send(SendParameters{
            to: msg.excess,
            value: 0, 
            mode: SendIgnoreErrors + SendRemainingValue
        })
    }

    get fun details(): TodoDetails {
        return TodoDetails{task: self.task, completed: self.completed};
    }
}
