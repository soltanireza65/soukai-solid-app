import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { IPersonData, Person } from "../models";
// import { fetchPeople } from "../utils";

const peopleAtom = atom<IPersonData[] | undefined>({
    key: "peopleAtom",
    default: undefined,
});

export const usePeople = () => {
    const [people, setPeople] = useRecoilState(peopleAtom);
    return { people, setPeople };
};

export const useGetPeople = (baseUri?: string) => {
    const [people, setPeople] = useRecoilState(peopleAtom);
    const run = async () => {
        try {
            // const persons = await fetchPeople(baseUri);
            let personObjs = await Person.from(baseUri + "/people/").all();
            let persons = personObjs?.map(p => ({ ...p.getAttributes(true) }) as IPersonData)
            setPeople(persons);
        } catch (error) {
            setPeople([]);
        }
    };
    useEffect(() => {
        run();
    }, [run]);

    return {
        people,
    };
};
