import "@stdlib/deploy";

contract Integers with Deployable {

    i1: Int as int257;
    i2: Int as uint256;
    i3: Int as int128;
    i4: Int as uint128;
    i5: Int as coin; // 2^120
    i6: Int as int64;
    i7: Int as uint64;
    i8: Int as int32;
    i9: Int as uint32;
    i10: Int as int16;
    i11: Int as uint16;
    i12: Int as int8;
    i13: Int as uint8;


    init() {
        self.i5 = ton("1.23")
    }

    receive() {
        let int1: Int as int16 = 0;
        // + - * / abs > < >= != == >> << % min max abs
    }
}
