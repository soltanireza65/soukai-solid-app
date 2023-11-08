import {
  Button,
  ButtonGroup,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  Bookmark,
  BookmarkFactory,
} from "@soukai-solid-data-modules/modules/Bookmarks";
import { FC, useEffect, useState } from "react";
import { SolidDocument, SolidModel } from "soukai-solid";
import { useUserSession } from "../atoms/userSession.atom";
import { v4 } from "uuid";


// import Movie from "soukai-solid/src/testing/lib/stubs/Movie"
const Bookmarks: FC = () => {
  const { userSession } = useUserSession();
  const [form, setForm] = useState({ title: "", link: "", hasTopic: "" });
  const [bookmarks, setBookmarks] = useState<(Bookmark & SolidModel)[]>([]);

  useEffect(() => {
    (async () => {
      if (!userSession) return;
      // console.log("🚀 ~ file: Bookmarks.tsx:19 ~ userSession:")

      const factory = await BookmarkFactory.getInstance(
        {
          webId: userSession?.info.webId ?? "",
          fetch: userSession?.fetch,
          isPrivate: true,
          // baseURL: pod,
          // containerUrl: pod + "bookmarks/",
          // typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
          // forClass: Bookmark.rdfsClasses[0]
        }
        // "bookmarks/"
      );

      const bookmarks = await factory.getAll();
      console.log("🚀 ~ file: Bookmarks.tsx:46 ~ bookmarks:", bookmarks.map(x => x.getAttributes()))
      // setBookmarks(bookmarks);

      // const res = await Bookmark.findOrFail(
      //   "https://solid-dm.solidcommunity.net/bookmarks/index.ttl#9a34eeec-01cc-4191-ad13-58c16ccf11f8"
      // );
      // console.log("🚀 ~ file: Bookmarks.tsx:37 ~ res:", res.getAttributes());
    })();
  }, []);

  return (
    <>
      <Flex gap={2}>
        <Input
          value={form?.title}
          placeholder="title"
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          value={form?.hasTopic}
          placeholder="hasTopic"
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, hasTopic: e.target.value }))
          }
        />
        <Input
          value={form?.link}
          placeholder="link"
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, link: e.target.value }))
          }
        />

        <Button
          onClick={async () => {
            const factory = await BookmarkFactory.getInstance(
              {
                webId: userSession?.info.webId ?? "",
                fetch: userSession?.fetch,
                isPrivate: true,
                // baseURL: pod,
                // containerUrl: pod + "bookmarks/",
                // typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl",
                // forClass: Bookmark.rdfsClasses[0]
              }
              // "bookmarks/"
            );

            const {hasTopic, ...rest} = form
            const bookmark = await factory.create(rest);

              

            // await registerInTypeIndex({
            //   forClass: Bookmark.rdfsClasses[0],
            //   instanceContainer: 'https://solid-dm.solidcommunity.net/bookmarks/',
            //   typeIndexUrl: 'https://solid-dm.solidcommunity.net/settings/privateTypeIndex.ttl',
            // });

            setForm({ title: "", link: "", hasTopic: "" });
          }}
        >
          ADD
        </Button>
      </Flex>
      <div>
        <Table
          variant="striped"
          size="sm"
        >
          <Thead>
            <Tr>
              <Th>Title</Th>
              {/* <Th>hasTopic</Th> */}
              <Th>Link</Th>
              <Th>actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookmarks?.map((b, i) => (
              <Tr key={i}>
                <Td>{b.title}</Td>
                {/* <Td>{b.hasTopic}</Td> */}
                <Td><a>{b.link}</a></Td>
                <Td>
                  <ButtonGroup variant="outline">
                    <Button
                      onClick={async () => {
                        const factory = await BookmarkFactory.getInstance({
                          webId: userSession?.info.webId ?? "",
                          fetch: userSession?.fetch,
                          isPrivate: true,
                        });

                        const bookmark = await factory.get(b.url);
                        console.log(
                          "🚀 ~ file: Bookmarks.tsx:122 ~ <ButtononClick={ ~ bookmark:",
                          bookmark.getAttributes()
                        );
                      }}
                    >
                      GET
                    </Button>

                    <Button
                      onClick={async () => {
                        const factory = await BookmarkFactory.getInstance({
                          webId: userSession?.info.webId ?? "",
                          fetch: userSession?.fetch,
                          isPrivate: true,
                        });

                        const bookmark = await factory.update(b.url, {
                          ...(b as any),
                          title: (Math.random() + 1).toString(36).substring(7),
                        });
                        console.log(
                          "🚀 ~ file: Bookmarks.tsx:122 ~ <ButtononClick={ ~ bookmark:",
                          bookmark?.getAttributes()
                        );
                      }}
                    >
                      UPD
                    </Button>

                    <Button
                      onClick={async () => {
                        const factory = await BookmarkFactory.getInstance({
                          webId: userSession?.info.webId ?? "",
                          fetch: userSession?.fetch,
                          isPrivate: true,
                        });

                        await factory.remove(b.url);
                      }}
                    >
                      DEL
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </>
  );
};

export default Bookmarks;
