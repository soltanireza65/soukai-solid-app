import { FieldType } from "soukai";
import { SolidModel } from "soukai-solid";

export interface IPersonData {
    url: string
    name: string
}

export class Person extends SolidModel {
    static rdfContexts = {
        'foaf': 'http://xmlns.com/foaf/0.1/',
    };

    static rdfsClasses = ['foaf:Person'];

    static fields = {
        name: {
            type: FieldType.String,
            rdfProperty: 'foaf:name',
        },
    };
}

export class Bookmark extends SolidModel {
    static rdfContexts = {
        'foaf': 'http://xmlns.com/foaf/0.1/',
    };

    // static rdfsClasses = ['foaf:Person'];

    static fields = {
        name: {
            type: FieldType.String,
            rdfProperty: 'foaf:name',
        },
    };
}
