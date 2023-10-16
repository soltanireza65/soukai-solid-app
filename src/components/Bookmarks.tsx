import { fetchContainerUrl } from "@/utils";
import {
  Box,
  Button,
  Flex,
  Input,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { getPodUrlAll } from "@inrupt/solid-client";
import {
  Bookmark,
  BookmarkFactory,
} from "@soukai-solid-data-modules/modules/Bookmarks";
import { FC, useEffect, useState } from "react";
import { SolidModel } from "soukai-solid";
import { useUserSession } from "../atoms/userSession.atom";

const getFactory = async ({
  fetch,
  containerUrl,
  baseURL,
  webId,
  typeIndexUrl
}: {
  fetch: any;
  containerUrl: string;
  baseURL: string;
  webId: string;
  typeIndexUrl?: string;
}) => {
  const _containerUrl = await fetchContainerUrl({
    fetch: fetch,
    forClass: Bookmark.rdfsClasses[0],
    baseURL: baseURL,
    webId: webId,
    typeIndexUrl: typeIndexUrl,
  });
  return BookmarkFactory.getInstance(_containerUrl ?? containerUrl);
};

const Bookmarks: FC = () => {
  let pod: string = "";
  const { userSession } = useUserSession();
  const [form, setForm] = useState({ title: "", link: "" });
  const [bookmarks, setBookmarks] = useState<(Bookmark & SolidModel)[]>([]);

  const init = async () => {
    pod = await getPodUrlAll(userSession?.info.webId ?? "", {
      fetch: userSession?.fetch,
    }).then((pods) => pods[0]);
    // userSession?.fetch, pod + "bookmarks/"
    const factory = await getFactory({
      baseURL: pod,
      containerUrl: pod + "bookmarks/",
      fetch: userSession?.fetch,
      webId: userSession?.info.webId ?? "",
      // typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl"
    });
    const bookmarks = await factory.getAll();
    setBookmarks(bookmarks);
  };

  useEffect(() => {
    init().then(() => { });
  }, [userSession]);

  //   public async initializeRemoteUsing(cookbook: SolidContainer): Promise<void> {
  //     const user = Auth.requireUser();
  //     const engine = Auth.requireAuthenticator().engine;

  //     await SolidContainer.withEngine(engine, async () => {
  //         const typeIndexUrl = user.privateTypeIndexUrl ?? await Auth.createPrivateTypeIndex();

  //         await cookbook.save();
  //         await cookbook.register(typeIndexUrl, Recipe);
  //     });

  //     await this.initializeRemoteCookbook(cookbook);
  //     await this.reloadRecipes();
  // }

  return (
    <>
      <Flex>
        <Input
          value={form?.title}
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          value={form?.link}
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, link: e.target.value }))
          }
        />

        <Button
          onClick={async () => {
            const factory = await getFactory({
              baseURL: pod,
              containerUrl: pod + "bookmarks/",
              fetch: userSession?.fetch,
              webId: userSession?.info.webId ?? "",
              // typeIndexUrl: "https://reza-soltani.solidcommunity.net/settings/privateTypeIndex.ttl"
            });

            console.log(
              "🚀 ~ file: Bookmarks.tsx:78 ~ onClick={ ~ factory.containerUrl:",
              factory?.containerUrl
            );

            const bookmark = await factory.create(form!);

            // setForm({ title: "", link: "" });
          }}
        >
          add
        </Button>
      </Flex>
      <Box>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookmarks?.map((b, i) => (
                <Tr key={i}>
                  <Td>{b.title}</Td>
                  <Td>
                    <Link>{b.link}</Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Bookmarks;
