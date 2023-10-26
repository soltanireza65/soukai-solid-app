
import { createTypeIndex, getTypeIndexFromPofile, registerInTypeIndex } from "@/utils";
import { FieldType, TimestampField } from "soukai";
import { Fetch, SolidContainer, defineSolidModelSchema } from "soukai-solid";
import { ISoukaiDocumentBase } from "../shared/contracts";

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


interface GetInstanceArgs {
    webId: string,
    fetch?: Fetch,
    typePredicate?: "solid:publicTypeIndex" | "solid:privateTypeIndex"
}

export class BookmarkFactory {
    private static instance: BookmarkFactory;

    private constructor(private containerUrl: string) { }

    public static async getInstance(args?: GetInstanceArgs, containerUrl?: string): Promise<BookmarkFactory> {
        if (!BookmarkFactory.instance) {
            // const typeIndexUrl = await createTypeIndex(args?.webId!, "private", args?.fetch)

            try {
                const baseURL = args?.webId.split("profile")[0] // https://example.solidcommunity.net/

                containerUrl = `${baseURL}${containerUrl ?? "bookmarks/"}`.replace("//", "/") // normalize url

                // await registerInTypeIndex({
                //     forClass: Bookmark.rdfsClasses[0],
                //     instanceContainer: containerUrl,
                //     typeIndexUrl: 'https://solid-dm.solidcommunity.net/settings/privateTypeIndex.ttl',
                // });

                let _containerUrl = ""

                const typeIndexUrl = await getTypeIndexFromPofile({
                    webId: args?.webId ?? "",
                    fetch: args?.fetch,
                    typePredicate: args?.typePredicate ?? "solid:privateTypeIndex"
                })

                if (typeIndexUrl) {
                    const _container = await SolidContainer.fromTypeIndex(typeIndexUrl, Bookmark)
                    if (!_container) {

                        _containerUrl = containerUrl

                        await registerInTypeIndex({
                            forClass: Bookmark.rdfsClasses[0],
                            instanceContainer: _containerUrl,
                            typeIndexUrl: typeIndexUrl,
                        });

                    } else {
                        _containerUrl = _container?.url ?? ""
                    }
                } else {
                    // Create TypeIndex
                    const typeIndexUrl = await createTypeIndex(args?.webId!, "private", args?.fetch)
                    _containerUrl = containerUrl

                    // add containerUrl to typeIndex
                    // TODO: it inserts two instances
                    await registerInTypeIndex({
                        forClass: Bookmark.rdfsClasses[0],
                        instanceContainer: _containerUrl,
                        typeIndexUrl: typeIndexUrl,
                    });
                }

                BookmarkFactory.instance = new BookmarkFactory(_containerUrl);

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