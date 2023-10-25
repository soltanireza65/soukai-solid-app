import { Flex } from "@chakra-ui/react";
import {
  Bookmark, BookmarkFactory
} from "@soukai-solid-data-modules/modules/Bookmarks";
import { FC, useEffect, useState } from "react";
import { SolidModel } from "soukai-solid";
import { useUserSession } from "../atoms/userSession.atom";

const Bookmarks: FC = () => {
  let pod: string = "";
  const { userSession } = useUserSession();
  const [form, setForm] = useState({ title: "", link: "" });
  const [bookmarks, setBookmarks] = useState<(Bookmark & SolidModel)[]>([]);

  useEffect(() => {
    (async () => {
      if (!userSession) return

      const factory = await BookmarkFactory.getInstance({
        webId: userSession?.info.webId ?? "",
        fetch: userSession?.fetch,
        typePredicate: "solid:privateTypeIndex"
        // baseURL: pod,
        // containerUrl: pod + "bookmarks/",
        // typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
        // forClass: Bookmark.rdfsClasses[0]
      },
        // "bookmarks/"
      );

      const bookmarks = await factory.getAll();
      setBookmarks(bookmarks);
    })()
  }, [userSession]);

  return (
    <>
      <Flex>
        <input
          value={form?.title}
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          value={form?.link}
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, link: e.target.value }))
          }
        />

        <button
          onClick={async () => {
            // const factory = await BookmarkFactory.getInstance({
            //   baseURL: pod,
            //   // containerUrl: pod + "bookmarks/",
            //   fetch: userSession?.fetch,
            //   webId: userSession?.info.webId ?? "",
            //   typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
            //   forClass: Bookmark.rdfsClasses[0]
            // },
            //   // pod + "bookmarks/"
            // );

            // const bookmark = await factory.create(form!);

            // setForm({ title: "", link: "" });
          }}
        >
          add
        </button>
      </Flex>
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks?.map((b, i) => (
              <tr key={i}>
                <td>{b.title}</td>
                <td>
                  <a>{b.link}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Bookmarks;