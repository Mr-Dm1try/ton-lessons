import "@stdlib/deploy";

contract Strings with Deployable {
    
    s1: String = "Hello world 😊 no escaping /n";

    init() {
        let i1: Int = -12345;
        let i2: Int = 6780000000; // coins = ton ("6.78")

        let s3: String = il.toString();
        let s4: String = il.toFloatString(3); // "-12.345"
        let s5: String = i2.toCoinsString(); // "6.78"

        let sb: StringBuilder = beginString();
        sb.append(s3);
        sb.append(" - hi - ");
        sb.append(s5);

        let s6: String = sb.toString();
    }
}
