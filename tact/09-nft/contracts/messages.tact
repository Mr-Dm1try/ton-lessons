message Transfer {
    queryId: Int as uint64;
    newOwner: Address;
}

struct CollectionData {
    newItemIndex: Int;
    content: Cell;
    owner: Address;
}

struct ItemData {
    index: Int;
    content: Cell;
    owner: Address;
    collection: Address;
}

struct CollectionMetadata {
    image: String;
    name: String;
    description: String;
    social_links: Cell;
}