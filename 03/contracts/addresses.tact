import "@stdlib/deploy";

contract Addresses with Deployable {

    //264-bit
    //storing 1000 address = 0.189 TON per year
    bounceable: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpA0g8xqB2N");
    nonBounceable: Adderss = address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpA0g8xqEBI");
    fullAddress: Address;

    a1: Address;
    a2: Address;
    a3: Address;

    init() {
        self.fullAddress = newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

        self.a1 = myAddress();
        self.a2 = sender();
        self.a3 = newAddress(0, 0);
    }

    receive() {
        self.bounceable == self.nonBounceable; // true
    }
}