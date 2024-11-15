import { NextResponse } from "next/server";
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
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return "";
      }
      return block.children.map((child) => child.text).join("");
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  try {
    let payload;
    try {
      payload = await request.json();
      console.log("Parsed Payload:", JSON.stringify(payload));
    } catch (jsonError) {
      console.warn("No JSON payload provided");
      return NextResponse.json(
        { error: "No payload provided" },
        { status: 400 }
      );
    }

    const { _id, operation, value } = payload;

    if (!operation || !_id || !value) {
      return NextResponse.json(
        { error: "Invalid payload, missing required fields" },
        { status: 400 }
      );
    }

    if (operation === "delete") {
      await algoliaClient.deleteObject({
        indexName,
        objectID: _id,
      });
      console.log(`Deleted object with ID: ${_id}`);
      return NextResponse.json({
        message: `Successfully deleted object with ID: ${_id}`,
      });
      // If the operation is not delete, index the document
    } else {
        await algoliaClient.saveObject({
        indexName,
        body: {
          ...value,
          objectID: _id,
        },
      });

      return NextResponse.json({
        message: "Successfully processed operation!",
      });
    }
  } catch (error: any) {
    console.error("Error indexing objects:", error.message);
    return NextResponse.json(
      { error: "Error indexing objects", details: error.message },
      { status: 500 }
    );
  }
}
