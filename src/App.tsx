import { useEffect, useState } from "react";
import { Person } from "./models";
import { createPerson, doLogin, doLogout, handleRedirectAfterLogin } from "./utils";
import { useUserSession } from "./atoms/userSession.atom";
import { useGetPeople } from "./atoms/people.atom";

function App() {
  const { userSession, setUserSession } = useUserSession();
  // const [baseUri, setBaseUri] = useState<string | undefined>("")
  // const [name, setName] = useState("")

  useEffect(() => {
    (async () => {
      // onSessionRestore((currentUrl) => window.location.href = currentUrl)
      await handleRedirectAfterLogin((loggedInSession) => {
        setUserSession(loggedInSession);
        // setBaseUri(`${loggedInSession.info.webId?.split("/profile")[0]}`)
        // rest in utils e.g. setEngine ...
      });
    })();
  }, []);

  return (
    <>{userSession?.info.isLoggedIn ? <LoggedInView /> : <GuestInView />}</>
  );
}

export default App;

const LoggedInView = () => {
  const [name, setName] = useState("");
  const { userSession } = useUserSession();
  const [baseUri, _] = useState<string | undefined>(
    `${userSession?.info.webId?.split("/profile")[0]}`
  );
  const { people } = useGetPeople(baseUri);

  return (
    <div>
      <button onClick={doLogout}>Logout</button>
      <pre>
        Logged in as: {userSession?.info.webId && userSession?.info.webId}
      </pre>
      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button
          onClick={async () => {
            await createPerson({ name }, baseUri)
            setName("");
          }}
        >
          add
        </button>

        <button
          onClick={async () => {
            const persons = await Person.from(baseUri + "/people/").all();
            persons.forEach(async (person) => {
              await userSession?.fetch(person.url, { method: "DELETE" });
              // await person.delete(); // sends too many GET requests before DELETE
            });
            // personUrls.forEach(async (personUrl) => {
            //   await userSession?.fetch(baseUri + "/people/" + personUrl, { method: 'DELETE' })
            // });
          }}
        >
          delete all
        </button>
      </div>

      {people?.map((p) => (
        <div>{p.name}</div>
      ))}
    </div>
  );
};

const GuestInView = () => {
  return (
    <div>
      <button onClick={doLogin}>Login</button>
    </div>
  );
};
