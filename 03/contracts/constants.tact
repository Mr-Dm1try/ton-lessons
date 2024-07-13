import "@stdlib/deploy";

const GlobalConst: Int = 100;

contract Constants with Deployable {

    const ContractConst: Int = 2000 + ton("1.23");
    // Empty init() function is present by default in all Tact contracts
    // since v1.3.0, so the following may be omitted:
    //
    // init() {}

    get fun constantSum() {
        return self.ContractConst + GlobalConst;
    }
}
