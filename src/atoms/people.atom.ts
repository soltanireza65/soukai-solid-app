import { atom, useRecoilState } from "recoil";
import { IPersonData, Person } from "../models";
import { useEffect, useState } from "react";
import { fetchPeople } from "../utils";

const peopleAtom = atom<IPersonData[] | undefined>({
    key: "peopleAtom",
    default: undefined
})


// export const usePeople = () => {
//     const [people, setPeople] = useRecoilState(peopleAtom)
//     return { people, setPeople }
// }



export const useGetPeople = (baseUri?: string) => {
    const [people, setPeople] = useRecoilState(peopleAtom)
    const run = async () => {
        try {
            // const persons = await Person.from(baseUri + "/people/").all();
            const persons = await fetchPeople(baseUri)
            setPeople(persons)
        } catch (error) {
            setPeople([])
        }
    };
    useEffect(() => {
        run()
    }, [run])

    return {
        people
    };
};