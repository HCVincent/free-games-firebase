import { Game } from "@/atoms/gamesAtom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
const URL = "https://www.acgfemdom.club";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs manually -->
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/tags</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
           <url>
               <loc>${`${URL}/games/${id}`}</loc>
           </url>
         `;
       })
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  let posts;
  try {
    const gameQuery = query(
      collection(firestore, "games"),
      orderBy("title", "asc")
    );

    const gameDocs = await getDocs(gameQuery);
    posts = gameDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log("readGames error", error);
  }
  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {}
