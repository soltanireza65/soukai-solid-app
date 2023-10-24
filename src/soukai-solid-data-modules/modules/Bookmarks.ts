
import { FieldType, TimestampField } from "soukai";
import { SolidContainer, defineSolidModelSchema } from "soukai-solid";
import { ISoukaiDocumentBase } from "../shared/contracts";
import { createPrivateTypeIndex, fetchContainerUrl, registerInTypeIndex, urlParentDirectory } from "@/utils";

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
        // console.log("🚀 ~ file: Bookmarks.ts:43 ~ BookmarkFactory ~ getInstance ~ getInstance:")
        // if(args){
        //     await createPrivateTypeIndex(args?.baseURL, args.webId, `${args.baseURL}profile/card`, fetch)
        // }
        if (!BookmarkFactory.instance) {
            // console.log("🚀 ~ file: Bookmarks.ts:48 ~ BookmarkFactory ~ getInstance ~ instance:")
            try {
                const _container = (await SolidContainer.fromTypeIndex(args?.typeIndexUrl!, Bookmark))
                if (_container) {
                    console.log("🚀 ~ file: Bookmarks.ts:50 ~ BookmarkFactory ~ getInstance ~ _container.url:", _container.url)
                    containerUrl = _container?.url
                }
                // if (!_container) {
                //     throw new Error("Container not found");
                // }
                if (!_container && containerUrl) {
                    
                    console.log("🚀 ~ file: Bookmarks.ts:57 ~ BookmarkFactory ~ getInstance ~ !_container && containerUrl:")

                    // TODO: it inserts two instances
                    await registerInTypeIndex({
                        forClass: Bookmark.rdfsClasses[0],
                        instanceContainer: containerUrl,
                        typeIndexUrl: args?.typeIndexUrl!,
                    });

                    const _container = (await SolidContainer.fromTypeIndex(args?.typeIndexUrl!, Bookmark))

                    containerUrl = _container?.url
                }
                // const _containerUrl = (await SolidContainer.fromTypeIndex(args?.typeIndexUrl!, Bookmark))?.url ?? ""
                // // if (args) {
                // //     _containerUrl = await fetchContainerUrl(args) ?? ""
                // //     console.log("🚀 ~ file: Bookmarks.ts:47 ~ BookmarkFactory ~ getInstance ~ _containerUrl:", _containerUrl)
                // // }

                BookmarkFactory.instance = new BookmarkFactory(containerUrl ?? "");



            } catch (error: any) {
                console.log(error.message);
            }
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

