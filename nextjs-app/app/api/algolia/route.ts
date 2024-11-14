import { NextResponse, NextRequest } from "next/server";
import { algoliasearch } from "algoliasearch";
import { createClient } from "@sanity/client";

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!;
const sanityProjectId = process.env.SANITY_PROJECT_ID!;
const sanityDataset = process.env.SANITY_DATASET!;

const algoliaClient = algoliasearch(algoliaAppId, algoliaApiKey);
const indexName = "my-index"; // Define the index name here

const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2021-03-25",
  useCdn: false,
});

interface Block {
  _type: string;
  children?: { text: string }[];
}

function toPlainText(blocks: Block[] = []) {
  return (
    blocks
      .map((block) => {
        if (block._type !== "block" || !block.children) {
          return "";
        }
        return block.children.map((child) => child.text).join("");
      })
      .join("\n\n")
  );
}

export async function POST(request: Request) {
  try {
    let payload;
    try {
      payload = await request.json();
      console.log("Parsed Payload:", JSON.stringify(payload));
    } catch (jsonError) {
      console.warn("No JSON payload provided");
    }

    // If no payload is present, perform a full reindex
    // if (!payload) {
    //   const sanityData = await sanityClient.fetch(`*[_type == "post"]{
    //     _id,
    //     title,
    //     "path": slug.current,
    //     content
    //   }`);

    //   const records = sanityData.map((doc: any) => ({
    //     objectID: doc._id,
    //     title: doc.title,
    //     path: doc.path,
    //     body: doc.content ? toPlainText(doc.content).slice(0, 9500) : '',
    //   }));

    //   await algoliaClient.saveObjects({
    //     indexName,
    //     objects: records,
    //   });

    //   console.log("Full reindex completed.");
    //   return NextResponse.json({ message: "Successfully reindexed all objects!" });
    // }

    const { _id, operation } = payload;
    
    console.log("Operation:", operation);

    if (operation === "delete") {
      await algoliaClient.deleteObject({
        indexName,
        objectID: _id,
      });
      console.log(`Deleted object with ID: ${_id}`);
    } else {
      console.log(operation);
      console.log('id', _id);
      
    }
    // } else {
    //   const doc = await sanityClient.fetch(
    //     `*[_id == $id][0]{
    //       _id,
    //       title,
    //       "path": slug.current,
    //       content
    //     }`,
    //     { id: _id }
    //   );

    //   if (!doc) {
    //     return NextResponse.json(
    //       { error: `Document with ID ${_id} not found in Sanity` },
    //       { status: 404 }
    //     );
    //   }

    //   const record = {
    //     objectID: doc._id,
    //     title: doc.title,
    //     path: doc.path,
    //     body: doc.content ? toPlainText(doc.content).slice(0, 9500) : '',
    //   };

    //   await algoliaClient.saveObject({
    //     indexName,
    //     body: record,
    //   });
    //   console.log(`Indexed object with ID: ${_id}`);
    // }

    return NextResponse.json({ message: "Successfully processed operation!" });
  } catch (error: any) {
    console.error("Error indexing objects:", error.message);
    return NextResponse.json(
      { error: "Error indexing objects", details: error.message },
      { status: 500 }
    );
  }
}
