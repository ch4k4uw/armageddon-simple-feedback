export class Topic {
    constructor(
        public id: string = "",
        public code: string = "",
        public title: string = "",
        public description: string = "",
        public author: string = "",
        public authorName: string = "",
        public expires: Date = new Date(0),
        public created: Date = new Date(0),
        public updated: Date = new Date(0),
    ) { }

    static readonly empty = new Topic();

    get isExpired(): boolean {
        return this.expires !== null && this.expires < (new Date());
    }

    cloneWith(
        id?: string,
        code?: string,
        title?: string,
        description?: string,
        author?: string,
        authorName?: string,
        created?: Date,
        updated?: Date,
    ): Topic {
        id = id == undefined ? this.id : id;
        code = code == undefined ? this.code : code;
        title = title == undefined ? this.title : title;
        description = description == undefined ? this.description : description;
        author = author == undefined ? this.author : author;
        authorName = authorName == undefined ? this.authorName : authorName;
        created = created == undefined ? this.created : created;
        updated = updated == undefined ? this.updated : updated;
        return new Topic(id, code, title, description, author, authorName, created, updated);
    }
}