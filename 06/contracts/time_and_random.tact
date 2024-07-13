import "@stdlib/deploy";

contract TimeAndRandom with Deployable {
    deployTime: Int as uint32; 

    init() {
        self.deployTime = now();
    }

    receive("1s") {
        require(now() - self.deployTime > 1, "Didn't wait lont enough");
        dump("thx for waiting 1s");
    }

    receive("10d") {
        require(now() - self.deployTime > 10*24*60*60, "Didn't wait lont enough");
        dump("thx for waiting 10 days");
    }

    get fun unixTime(): Int {
        return now();
    }

    get fun rand(): Int {
        return randomInt();
    }

    get fun randomBetween(from: Int, to: Int): Int {
        return random(from, to);
    }
}
