
import { FieldType, TimestampField } from "soukai";
import { defineSolidModelSchema } from "soukai-solid";
import { ISoukaiDocumentBase } from "../shared/contracts";
import { fetchContainerUrl, registerInTypeIndex, urlParentDirectory } from "@/utils";
// import { fetchContainerUrl, registerInTypeIndex, urlParentDirectory } from "../shared/utils";


export type ICreateBookmark = {
    title: string
    link: string
}

export type IBookmark = ISoukaiDocumentBase & ICreateBookmark

export const BookmarkSchema = defineSolidModelSchema({
    rdfContexts: {
        'bookm': 'http://www.w3.org/2002/01/bookmark#',
        'dct': 'http://purl.org/dc/terms/',
    },
    rdfsClasses: ['bookm:Bookmark'],
    timestamps: [TimestampField.CreatedAt],
    fields: {
        title: {
            type: FieldType.String,
            rdfProperty: 'dct:title',
        },
        link: {
            type: FieldType.String,
            rdfProperty: 'bookm:recalls',
        },
    },
});

export class Bookmark extends BookmarkSchema { }


// interface GetFactoryArgs { fetch: any; containerUrl: string; baseURL: string; webId: string; typeIndexUrl?: string; }

// export const getFactory = async (args: GetFactoryArgs) => {
//     return await BookmarkFactory.getInstance({
//         ...args,
//         forClass: Bookmark.rdfsClasses[0],
//     });
// };

export class BookmarkFactory {
    private static instance: BookmarkFactory;

    private constructor(private containerUrl: string) { }

    public static async getInstance({
        containerUrl, forClass, baseURL, webId, typeIndexUrl, fetch
    }: {
        containerUrl: string,
        forClass: string,
        baseURL: string,
        webId: string,
        typeIndexUrl?: string,
        fetch?: any
    }): Promise<BookmarkFactory> {
        if (!BookmarkFactory.instance) {
            const _containerUrl = await fetchContainerUrl({ fetch, forClass, baseURL, webId, typeIndexUrl });
            BookmarkFactory.instance = new BookmarkFactory(containerUrl ?? _containerUrl);
        }
        return BookmarkFactory.instance;
    }

    async getAll() {
        return await Bookmark.from(this.containerUrl).all();
    }

    async get(id: string) {
        return await Bookmark.from(this.containerUrl).find(id);
    }

    async create(payload: ICreateBookmark) {
        const bookmark = new Bookmark(payload);
        return await await bookmark.save(this.containerUrl);
    }

    async update(id: string, payload: IBookmark) {
        // const bookmark = await Bookmark.find(id);
        // return await await bookmark?.update(payload);
        const bookmark = new Bookmark(payload);

        const bookmarkObj = await bookmark.save(this.containerUrl);

        const instanceContainer = urlParentDirectory(bookmarkObj.url);

        registerInTypeIndex({
            forClass: Bookmark.rdfsClasses[0],
            instanceContainer: instanceContainer ?? this.containerUrl,
            typeIndexUrl:
                "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
        });

        return bookmarkObj;

    }

    async remove(id: string) {
        const bookmark = await Bookmark.find(id);
        return await await bookmark?.delete();
    }
}
