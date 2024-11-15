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

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const initialIndex = searchParams.get("initialIndex") === "true";

    if (initialIndex) {
      // Initial indexing process
      console.log("Starting initial indexing...");
      const sanityData = await sanityClient.fetch(`*[_type == "post"]{
        _id,
        title,
        slug,
        "body": pt::text(content),
        _type,
        coverImage,
        date,
        _createdAt,
        _updatedAt
      }`);

      const records = sanityData.map((doc: any) => ({
        objectID: doc._id,
        title: doc.title,
        slug: doc.slug.current,
        body: doc.body?.slice(0, 9500), // Truncate if necessary
        coverImage: doc.coverImage,
        date: doc.date,
        _createdAt: doc._createdAt,
        _updatedAt: doc._updatedAt,
      }));

      // Save all records to Algolia
      await algoliaClient.saveObjects({
        indexName,
        objects: records,
      });

      console.log("Initial indexing completed.");
      return NextResponse.json({
        message: "Successfully completed initial indexing!",
      });
    }

    // Incremental updates based on webhook payload
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
      // Handle delete operation
      await algoliaClient.deleteObject({
        indexName,
        objectID: _id,
      });
      console.log(`Deleted object with ID: ${_id}`);
      return NextResponse.json({
        message: `Successfully deleted object with ID: ${_id}`,
      });
    } else {
      // Add or update the document in Algolia
      await algoliaClient.saveObject({
        indexName,
        body: {
          ...value,
          objectID: _id,
        },
      });

      console.log(`Indexed/Updated object with ID: ${_id}`);
      return NextResponse.json({
        message: `Successfully processed document with ID: ${_id}!`,
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

