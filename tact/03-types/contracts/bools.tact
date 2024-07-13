import "@stdlib/deploy";

contract Bools with Deployable {

    b1: Bool = true;
    // Empty init() function is present by default in all Tact contracts
    // since v1.3.0, so the following may be omitted:
    //
    // init() {}
}
