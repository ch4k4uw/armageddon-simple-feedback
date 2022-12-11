export class Topic {
    private _expires: Date;
    private _created: Date;
    private _updated: Date;
    constructor(
        public id: string = "",
        public code: string = "",
        public title: string = "",
        public description: string = "",
        public author: string = "",
        public authorName: string = "",
        expires: Date = new Date(0),
        created: Date = new Date(0),
        updated: Date = new Date(0),
    ) { 
        this._expires = expires;
        this._created = created;
        this._updated = updated;
    }

    static readonly empty = new Topic();

    get expires() {
        return new Date(this._expires.getTime());
    }
    
    get created() {
        return new Date(this._created.getTime());
    }
    
    get updated() {
        return new Date(this._updated.getTime());
    }

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