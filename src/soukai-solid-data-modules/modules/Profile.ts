
import { FieldType, TimestampField } from "soukai";
import { defineSolidModelSchema } from "soukai-solid";
import { ISoukaiDocumentBase } from "../shared/contracts";


export type ICreateProfile = {
    'name': string
    'organization-name': string
    'hasEmail': string
    'bday': string
    'hasTelephone': string
}

export type IProfile = ISoukaiDocumentBase & ICreateProfile

export const ProfileSchema = defineSolidModelSchema({
    rdfContexts: {
        'dct': 'http://purl.org/dc/terms/',
        'ns': 'http://www.w3.org/2006/vcard/ns#',
    },
    rdfsClasses: ['foaf:Person', 'schema:Person'],
    fields: {
        'name': { type: FieldType.String, rdfProperty: 'foaf:name' },
        'organization-name': { type: FieldType.String, rdfProperty: 'ns:organization-name' },
        'hasEmail': { type: FieldType.String, rdfProperty: 'ns:hasEmail' },
        'bday': { type: FieldType.String, rdfProperty: 'ns:bday' },
        'hasTelephone': { type: FieldType.String, rdfProperty: 'ns:hasTelephone' },
    },
});


export class Profile extends ProfileSchema { }

export class ProfileFactory {
    private static instance: ProfileFactory;

    private constructor(private containerUrl: string) { }

    public static getInstance(containerUrl: string): ProfileFactory {
        if (!ProfileFactory.instance) {
            ProfileFactory.instance = new ProfileFactory(containerUrl);
        }
        return ProfileFactory.instance;
    }

    async getAll() {
        return await Profile.all();
    }

    async get(id: string) {
        return await Profile.find(id);
    }

    async create(payload: ICreateProfile) {
        const profile = new Profile(payload);
        return await await profile.save(this.containerUrl);
    }

    async update(id: string, payload: IProfile) {
        const profile = await Profile.find(id);
        return await await profile?.update(payload);
    }

    async remove(id: string) {
        const profile = await Profile.find(id);
        return await await profile?.delete();
    }
}
