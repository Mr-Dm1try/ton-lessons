import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./todo_child";

contract TodoParent with Deployable, Ownable {

    owner: Address;
    childsCount: Int as uint256 = 0;

    init() {
        self.owner = sender();
    }

    receive(msg: NewTodo) {
        self.childsCount += 1;
        let init: StateInit = initOf TodoChild(myAddress(), self.childsCount);
         
        send(SendParameters{
            to: contractAddress(init),
            body: InternalSetTask{task: msg.task}.toCell(),
            value: ton("0.2"),
            mode: SendIgnoreErrors,
            code: init.code,
            data: init.data
        });

        self.reply(NewTodoResponse{seqno: self.childsCount}.toCell());
    }

    receive(msg: CompleteTodo) {
        self.requireOwner();
        require(msg.seqno <= self.childsCount, "Todo doesnt exist");

        send(SendParameters{
            to: contractAddress(initOf TodoChild(myAddress(), msg.seqno)),
            body: InternalComplete{excess: sender()}.toCell(),
            value: 0,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }

    get fun count(): Int {
        return self.childsCount; 
    }

    get fun todoAddress(seqno: Int): Address {
        return contractAddress(initOf TodoChild(myAddress(), seqno)); 
    }
}
