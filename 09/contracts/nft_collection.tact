import "@stdlib/deploy";
import "@stdlib/ownable";
import "./nft_item";
import "./messages";

contract NftCollection with Deployable, Ownable {
    const minTonForStorage: Int = ton("0.03");
    const gasConsumption: Int = ton("0.03");

    owner: Address;
    nextItemIndex: Int as uint32 = 0;
    collectionContent: String = "Some Random NFT Collection";

    init() {
        self.owner = sender();
    }

    receive("mint") {
        self.requireOwner();
        self.mint(self.owner);
    }

    fun mint(receiver: Address) {
        require(self.nextItemIndex >= 0, "Illegal state");

        let nftInit: StateInit = self.nftItemInit(self.nextItemIndex);
        let ctx: Context = context();
        let msgCoins: Int = ctx.value;
        let balanceBefore: Int = myBalance() - msgCoins;
        let storageFee: Int = self.minTonForStorage - min(balanceBefore, self.minTonForStorage);
        msgCoins -= storageFee + self.gasConsumption;
        
        send(SendParameters{
            to: contractAddress(nftInit),
            value: msgCoins,
            mode: SendIgnoreErrors,
            body: Transfer{
                queryId: 0,
                newOwner: receiver
            }.toCell(),
            code: nftInit.code,
            data: nftInit.data
        });
        
        self.nextItemIndex += 1; 
    }

    get fun nftItemInit(index: Int): StateInit {
        let content: StringBuilder = beginString();
        content.append("Item #");
        content.append(index.toString());

        return initOf NftItem(
            self.owner,
            myAddress(),
            index,
            content.toString()
        );
    }

    get fun nftItemAddress(index: Int): Address {
        let init: StateInit = self.nftItemInit(index);

        return contractAddress(init);
    }

    get fun collectionData(): CollectionData {
        return CollectionData{
            newItemIndex: self.nextItemIndex,
            content: self.collectionContent.asSlice().asCell(),
            owner: self.owner
        };
    }
}
