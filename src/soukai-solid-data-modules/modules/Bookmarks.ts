
import { FieldType, TimestampField } from "soukai";
import { defineSolidModelSchema } from "soukai-solid";
import { ISoukaiDocumentBase } from "../shared/contracts";
import { fetchContainerUrl, registerInTypeIndex, urlParentDirectory } from "@/utils";

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


interface GetInstanceArgs { forClass: string, baseURL: string, webId: string, typeIndexUrl?: string, fetch?: any }
export class BookmarkFactory {
    private static instance: BookmarkFactory;

    private constructor(private containerUrl: string) { }

    public static async getInstance(args?: GetInstanceArgs, containerUrl?: string): Promise<BookmarkFactory> {
        if (!BookmarkFactory.instance) {
            let _containerUrl = ""
            if (args) {
                _containerUrl = await fetchContainerUrl(args) ?? ""
                console.log("🚀 ~ file: Bookmarks.ts:47 ~ BookmarkFactory ~ getInstance ~ _containerUrl:", _containerUrl)
            }
            BookmarkFactory.instance = new BookmarkFactory(containerUrl ?? _containerUrl);
            
            // if (_containerUrl === "" && containerUrl) {
            //     // alert("registerInTypeIndex")
            //     await registerInTypeIndex({
            //         forClass: Bookmark.rdfsClasses[0],
            //         instanceContainer: containerUrl,
            //         typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
            //     });
            // }
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

        // const instanceContainer = urlParentDirectory(bookmark?.url ?? "");

        // await registerInTypeIndex({
        //     forClass: Bookmark.rdfsClasses[0],
        //     instanceContainer: instanceContainer ?? this.containerUrl,
        //     typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
        // });

        return await bookmark.save(this.containerUrl);
    }

    async update(id: string, payload: IBookmark) {
        const bookmark = await Bookmark.find(id);
        return await bookmark?.update(payload);
    }

    async remove(id: string) {
        const bookmark = await Bookmark.find(id);
        return await bookmark?.delete();
    }
}

