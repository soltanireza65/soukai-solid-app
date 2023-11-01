
import { createTypeIndex, fetchContainerUrl, fromTypeIndex, getTypeIndexFromPofile, registerInTypeIndex } from "@/utils";
import { Attributes, FieldType, Model, TimestampField } from "soukai";
import { Fetch, SolidContainer, SolidModel, defineSolidModelSchema } from "soukai-solid";
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

export class Bookmark extends BookmarkSchema {
    // protected initialize(attributes: Attributes, exists: boolean): void {

    // }
    // newInstance({ url: "url" }, true)
    // newInstance<T extends Model>(this: T, attributes?: Attributes | undefined, exists?: boolean | undefined): T {
        
    // }
}

interface GetInstanceArgs {
    webId: string,
    fetch?: Fetch,
    typePredicate?: "solid:publicTypeIndex" | "solid:privateTypeIndex"
}



export class BookmarkFactory {
    private static instance: BookmarkFactory;

    private constructor(private containerUrls: string[] = []) { }

    public static async getInstance(args?: GetInstanceArgs, defaultContainerUrl?: string): Promise<BookmarkFactory> {
        if (!BookmarkFactory.instance) {
            try {
                const baseURL = args?.webId.split("profile")[0] // https://example.solidcommunity.net/

                defaultContainerUrl = `${baseURL}${defaultContainerUrl ?? "bookmarks/"}` //.replace("//", "/") // normalize url

                console.log("🚀 ~ file: Bookmarks.ts:57 ~ BookmarkFactory ~ getInstance ~ defaultContainerUrl:", defaultContainerUrl)
                let _containerUrls: string[] = []

                const typeIndexUrl = await getTypeIndexFromPofile({
                    webId: args?.webId ?? "",
                    fetch: args?.fetch,
                    typePredicate: args?.typePredicate ?? "solid:privateTypeIndex"
                })

                if (typeIndexUrl) {
                    const res = await fromTypeIndex(typeIndexUrl, Bookmark)
                    console.log("🚀 ~ file: Bookmarks.ts:70 ~ BookmarkFactory ~ getInstance ~ res:", res?.map(c => c.url))

                    const _containers = await SolidContainer.fromTypeIndex(typeIndexUrl, Bookmark)
                    console.log("🚀 ~ file: Bookmarks.ts:68 ~ BookmarkFactory ~ getInstance ~ _containers:", _containers.map(c => c.url))

                    if (!_containers || !_containers.length) {

                        _containerUrls.push(defaultContainerUrl)

                        await registerInTypeIndex({
                            forClass: Bookmark.rdfsClasses[0],
                            instanceContainer: _containerUrls[0],
                            typeIndexUrl: typeIndexUrl,
                        });

                    } else {
                        _containerUrls = [..._containerUrls, ..._containers.map(c => c.url)]
                    }
                } else {
                    // Create TypeIndex
                    const typeIndexUrl = await createTypeIndex(args?.webId!, "private", args?.fetch)
                    _containerUrls.push(defaultContainerUrl)

                    // TODO: it inserts two instances
                    await registerInTypeIndex({
                        forClass: Bookmark.rdfsClasses[0],
                        instanceContainer: _containerUrls[0],
                        typeIndexUrl: typeIndexUrl,
                    });
                }

                BookmarkFactory.instance = new BookmarkFactory(_containerUrls);

            } catch (error: any) {
                console.log(error.message);
            }
        }
        return BookmarkFactory.instance;
    }

    async getAll() {
        const promises = this.containerUrls.map(c => Bookmark.from(c).all())

        const allPromise = Promise.all(promises);

        try {
            const values = (await allPromise).flat();
            return values
        } catch (error) {
            console.log(error);
            return [] as (Bookmark & SolidModel)[]
        }

        // return await Bookmark.from(this.containerUrl).all();
    }

    async get(id: string) {
        const promises = this.containerUrls.map(c => Bookmark.from(c).find(id))
        const allPromise = Promise.all(promises);
        try {
            const values = (await allPromise).flat();

            return values[0]

        } catch (error) {
            console.log(error);
            return undefined
        }
        // return await Bookmark.from(this.containerUrl).find(id);
    }

    async create(payload: ICreateBookmark) {
        const bookmark = new Bookmark(payload);
        return await bookmark.save(this.containerUrls[0]);
    }

    async update(id: string, payload: IBookmark) {
        const promises = this.containerUrls.map(c => Bookmark.from(c).find(id))
        const allPromise = Promise.all(promises);
        try {
            const values = (await allPromise).flat();

            return values.map(v => v?.update(payload))

        } catch (error) {
            console.log(error);
            return undefined
        }


        // const bookmark = await Bookmark.from(this.containerUrl).find(id)
        // return await bookmark?.update(payload);
    }

    async remove(id: string) {
        const promises = this.containerUrls.map(c => Bookmark.from(c).find(id))
        const allPromise = Promise.all(promises);
        try {
            const values = (await allPromise).flat();

            return values.map(async (v) => await v?.delete())

        } catch (error) {
            console.log(error);
            return undefined
        }

        // const bookmark = await Bookmark.from(this.containerUrl).find(id)
        // return await bookmark?.delete();
    }
}