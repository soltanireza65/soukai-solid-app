// export { Bookmark, BookmarkFactory, BookmarkSchema, IBookmark, ICreateBookmark } from './modules/Bookmarks';
// export { Profile, ProfileFactory, ProfileSchema, IProfile, ICreateProfile } from './modules/Profile';

import { SolidModel } from "soukai-solid";


export class TypeIndex extends SolidModel {
    static rdfsClasses = ['solid:TypeIndex', 'solid:UnlistedDocument', 'solid:ListedDocument',];
}
