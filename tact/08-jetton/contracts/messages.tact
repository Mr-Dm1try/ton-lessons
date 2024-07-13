message NewTodo {
    task: String;
}

message NewTodoResponse {
    seqno: Int as uint256;
}

message CompleteTodo {
    seqno: Int as uint256;
}

message InternalSetTask {
    task: String; 
}

message InternalComplete {
    excess: Address;
}

// ----------------------------

message InternalAdd {
    amount: Int as coins;
    origin: Address;
}

message Transfer {
    amount: Int as coins;
    to: Address;
}

message Mint {
    amount: Int as coins;
}
