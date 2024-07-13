import "@stdlib/deploy";

message MessageOpt {
    number: Int? as uint32;
}

struct StructOpt {
    message: String?;
}

contract Optional with Deployable {
    num: Int?;
    bool: Bool?;
    st: StructOpt?;

    init (a: Int) {
        self.num = a;
        self.st = StructOpt{message: "Hello"};
    }

    receive(msg: MessageOpt) {
        if (msg.number != null) {
            self.num = msg.number!!;
        }
    }

    get fun optionalInt(): Int? {
        return self.num; 
    }

    get fun optionalOrDefault(): Int {
        return self.num == null ? -1 : self.num!!;
    }

    get fun optionalNested(): String {
        return self.st != null && self.st!!.message != null
            ? self.st!!.message!!
            : "empty";
    }
}
