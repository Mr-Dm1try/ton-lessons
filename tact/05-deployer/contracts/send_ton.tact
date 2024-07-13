import "@stdlib/deploy";

message Withdraw {
    amount: Int as coins;
}

contract SendTon with Deployable {
    const MinTonForStorage: Int = ton("0.01");  // 1 kB for 2.5 years

    owner: Address;

    init() {
        self.owner = sender();
    }

    fun onlyOwner() {
        require(sender() == self.owner, "U're not the owner");
    }

    fun amountAboveZero(amount: Int) {
        require(amount > 0, "Insufficient balance");
    }

    receive() {

    }

    receive("withdraw all") {
        self.onlyOwner();

        send(SendParameters{
            to: sender(),
            bounce: true, 
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    receive("withdraw safe") {
        self.onlyOwner();
        let amount = myBalance() - context().value - self.MinTonForStorage;
        self.amountAboveZero(amount);

        send(SendParameters{
            to: sender(),
            bounce: true, 
            value: amount,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }

    receive(message: Withdraw) {
        self.onlyOwner();
        let amount: Int = min(message.amount, myBalance() - context().value - self.MinTonForStorage);
        self.amountAboveZero(amount);

        send(SendParameters{
            to: sender(),
            bounce: true, 
            value: amount,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }

    get fun balance(): Int {
        return myBalance();
    }

    // receive() {
    //     send(SendParameters{
    //         to: sender(),
    //         value: 0,
    //         mode: SendIgnoreErrors,
    //         bounce: true,
    //         body: "Hello world".asComment()
    //     })
    //     // == 
    //     self.reply("Hello World".asComment())

    //     context().bounced
    //     context().sender
    //     context().value
    //     context().raw   //slice of data
    // }

}
