// import { SolidDocumentPermission, createPrivateTypeIndex, createPublicTypeIndex } from '@noeldemartin/solid-utils';
// import type { SolidUserProfile } from '@noeldemartin/solid-utils';
// import { SolidModelConstructor, defineSolidModelSchema } from 'soukai-solid';


// const Model = defineSolidModelSchema({
//     rdfContexts: { solid: 'http://www.w3.org/ns/solid/terms#' },
//     rdfsClass: 'TypeIndex',
//     timestamps: false,
// });

// export default class SolidTypeIndex extends Model {

//     public static async createPublic<T extends SolidTypeIndex>(
//         this: SolidModelConstructor<T>,
//         user: SolidUserProfile,
//         fetch: any
//     ): Promise<T> {
//         const url = await createPublicTypeIndex(user, fetch);
//         const instance = await this.findOrFail(url);

//         await instance.updatePublicPermissions([SolidDocumentPermission.Read]);

//         return instance;
//     }

//     public static async createPrivate<T extends SolidTypeIndex>(
//         this: SolidModelConstructor<T>,
//         user: SolidUserProfile,
//         fetch: any
//     ): Promise<T> {
//         const url = await createPrivateTypeIndex(user, fetch);
//         const instance = await this.findOrFail(url);

//         return instance;
//     }

// }