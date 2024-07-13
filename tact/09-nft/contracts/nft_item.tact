import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract NftItem with Deployable, Ownable {

    owner: Address;
    collection: Address;
    index: Int as uint32;
    content: String;

    init(
        owner: Address,
        collection: Address,
        index: Int,
        content: String
    ) {
        self.owner = owner;
        self.collection = collection;
        self.index = index;
        self.content = content;
    }

    receive(msg: Transfer) {
        self.requireOwner();

        self.owner = msg.newOwner;
    }

    get fun itemData(): ItemData {
        return ItemData{
            index: self.index,
            content: self.content.asSlice().asCell(),
            owner: self.owner,
            collection: self.collection
        };
    }
}
