import "@stdlib/deploy";

contract Loops with Deployable {
    
    receive("repeat") {

        let i: Int = 0;
        let sum: Int = 0;
        repeat(10) {
            i += 1;
            sum += i;
        }

        dump(sum);
    }

    receive("while") {

        let i: Int = 0;
        let sum: Int = 0;
        while(i < 10) {
            i += 1;
            sum += i;
        }

        dump(sum);
    }

    receive("until") {

        let i: Int = 0;
        let sum: Int = 0;
        do {
            i += 1;
            sum += i;
        } until(i >= 10);

        dump(sum);
    }
}
