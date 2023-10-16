import { registerInTypeIndex, urlParentDirectory } from "@/utils";
import { FieldType, TimestampField } from "soukai";
import {
    defineSolidModelSchema
} from "soukai-solid";
import { ISoukaiDocumentBase } from "../shared/contracts";

export type ICreateBookmark = {
    title: string;
    link: string;
};

export type IBookmark = ISoukaiDocumentBase & ICreateBookmark;

export const BookmarkSchema = defineSolidModelSchema({
    rdfContexts: {
        bookm: "http://www.w3.org/2002/01/bookmark#",
        dct: "http://purl.org/dc/terms/",
    },
    rdfsClasses: ["bookm:Bookmark"],
    timestamps: [TimestampField.CreatedAt],
    fields: {
        title: {
            type: FieldType.String,
            rdfProperty: "dct:title",
        },
        link: {
            type: FieldType.String,
            rdfProperty: "bookm:recalls",
        },
    },
});

export class Bookmark extends BookmarkSchema { }

export class BookmarkFactory {
    private static instance: BookmarkFactory;

    private constructor(public containerUrl: string) { }

    public static getInstance(containerUrl: string): BookmarkFactory {
        if (!BookmarkFactory.instance) {
            BookmarkFactory.instance = new BookmarkFactory(containerUrl);
        }
        return BookmarkFactory.instance;
    }

    async getAll() {
        // console.log("🚀 ~ file: Bookmarks.ts:51 ~ BookmarkFactory ~ getAll ~ getAll:")

        return await Bookmark.from(this.containerUrl).all();
    }

    async get(id: string) {
        // console.log("🚀 ~ file: Bookmarks.ts:56 ~ BookmarkFactory ~ get ~ get:")
        return await Bookmark.find(id);
    }

    async create(payload: ICreateBookmark) {
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

    async update(id: string, payload: IBookmark) {
        const bookmark = await Bookmark.find(id);
        return await bookmark?.update(payload);
    }

    async remove(id: string) {
        const bookmark = await Bookmark.find(id);
        return await bookmark?.delete();
    }
}
