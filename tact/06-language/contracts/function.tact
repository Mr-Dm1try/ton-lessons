import "@stdlib/deploy";

//Global function
fun sum(a: Int, b: Int): Int {
    return a + b;
}

//Extention function
extends fun multipy(self: Int, b: Int): Int {
    return self * b;
}

//Mutable extention function
extends mutates fun add(self: Int, b: Int) {
    self += b
}

//FunC function
// @name(store_unit)
// native store_unit(s: Builder, value: Int, bits: Int): Builder;

contract Function with Deployable {
    num: Int as uint8 = 5; 

    receive() {

    }

    bounced(msg: Slice) {

    }

    receive("add") {
        self.num.add(5);
    }

    get fun balance(): Int {
        return myBalance();
    }

    fun f1() {
        sum(2, 5);
    }

    get fun multipy(): Int {
        return self.num.multipy(5);
    }
}
