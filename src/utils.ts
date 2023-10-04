import { ISessionInfo, Session, getDefaultSession, handleIncomingRedirect, login, logout } from "@inrupt/solid-client-authn-browser";
import { bootModels, setEngine } from "soukai";
import { SolidEngine, bootSolidModels } from "soukai-solid";
import { IPersonData, Person } from "./models";

export async function doLogin() {
    await login({
        clientName: "bookmarks",
        oidcIssuer: "https://solidcommunity.net",
        redirectUrl: window.location.href,
    });
}
export function doLogout() {
    logout()
    // .then(() => {
    //     // location.reload()
    // })
    window.location.reload()
}

export async function handleRedirectAfterLogin(cb: (loggedInSession: Session) => void) {
    const sessionInfo: ISessionInfo | undefined = await handleIncomingRedirect({ restorePreviousSession: true }); // no-op if not part of login redirect
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
        cb(session) // setUserSession(session)
        setEngine(new SolidEngine(session.fetch));
    }
}


export function bootSoukai() {
    bootSolidModels();
    bootModels({ Person: Person });
}

// https://soltanireza65.solidcommunity.net/people/d02633e0-47f3-45dd-93f0-91a604a971c3
export const personUrls = [
    "d02633e0-47f3-45dd-93f0-91a604a971c3",
]

export const fetchPeople = async (baseUri?: string): Promise<IPersonData[] | undefined> => {
    if (baseUri) {
        const persons = await Person.from(baseUri + "/people/").all();
        return persons?.map(p => ({ ...p.getAttributes(true) }) as IPersonData)
    }
}

export async function createPerson({ name }: { name: string }, baseUri?: string) {
    const person = new Person({ name: name });
    await person.save(baseUri + "/people/");
}