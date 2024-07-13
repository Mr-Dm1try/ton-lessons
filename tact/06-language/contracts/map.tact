import "@stdlib/deploy";

message Replace{
    items: map<Int, Bool>;
}

message Add {
    key: Int;
    value: Int;
}

contract Map with Deployable {

    intMap: map<Int, Bool>;

    bothIntMap: map<Int, Int>;

    addressMap: map<Address, Bool>;

    init(arg: map<Int, Bool>) {
        self.intMap = arg;
    }

    receive("set keys") {
        self.intMap.set(345, true);
        self.addressMap.set(myAddress(), false);
    }

    receive("delete keys") {
        self.intMap.set(345, null);
        self.addressMap.set(myAddress(), null);
    }

    receive(msg: Replace) {
        self.intMap = msg.items;
    }

    receive("clear") {
        self.intMap = emptyMap();
        self.addressMap = emptyMap();
    }

    receive(msg: Add) {
        self.bothIntMap.set(msg.key, msg.value);
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors
        })
    }

    get fun byKey(key: Int): Bool? {
        return self.intMap.get(key);
    }

    get fun fullMap(): map<Int, Bool> {
        return self.intMap;
    }
}
