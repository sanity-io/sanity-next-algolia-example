import { NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";
import { createClient } from "@sanity/client";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!;
const sanityProjectId = process.env.SANITY_PROJECT_ID!;
const sanityDataset = process.env.SANITY_DATASET!;
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET!;

const algoliaClient = algoliasearch(algoliaAppId, algoliaApiKey);
const indexName = "my-index";

const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2021-03-25",
  useCdn: false,
});

const MAX_RECORD_SIZE = 10000; // Maximum size in bytes for an Algolia record


// Function to estimate the size of a record
function estimateRecordSize(record: Record<string, unknown>): number {
  return new TextEncoder().encode(JSON.stringify(record)).length;
}

// Function to truncate oversized fields
function truncateOversizedField(field: string, maxLength: number): string {
  return field.length > maxLength ? field.slice(0, maxLength) : field;
}

// Function to shard a document into multiple Algolia records
function shardDocument(doc: any): any[] {
  const baseRecord = {
    objectID: doc._id,
    title: doc.title,
    slug: doc.slug?.current,
    coverImage: doc.coverImage,
    date: doc.date,
    _createdAt: doc._createdAt,
    _updatedAt: doc._updatedAt,
  };

  // Split the body field into chunks if it's too large
  const chunks = doc.body?.match(/.{1,9000}/g) || [''];
  return chunks.map((chunk: string, index: number) => ({
    ...baseRecord,
    body: chunk,
    objectID: `${doc._id}-${index}`, // Unique ID for each shard
    shardIndex: index,
  }));
}

// Function to perform initial indexing
async function performInitialIndexing() {
  console.log("Starting initial indexing...");

  // Fetch all documents from Sanity
  const sanityData = await sanityClient.fetch(`*[_type == "post"]{
    _id,
    title,
    slug,
    "body": pt::text(content),
    _type,
    "coverImage": coverImage.asset->url,
    date,
    _createdAt,
    _updatedAt
  }`);

  const records: { 
    objectID: string; 
    title: string; 
    slug: string; 
    coverImage?: string; 
    date?: string; 
    _createdAt: string; 
    _updatedAt: string; 
    body?: string; 
    shardIndex?: number;
  }[] = [];

  sanityData.forEach((doc: any) => {
    const baseRecord = {
      objectID: doc._id,
      title: truncateOversizedField(doc.title, 100), // Truncate title if needed
      slug: doc.slug?.current || '',
      coverImage: doc.coverImage,
      date: doc.date,
      _createdAt: doc._createdAt,
      _updatedAt: doc._updatedAt,
    };

    const recordSize = estimateRecordSize(baseRecord);

    if (recordSize > MAX_RECORD_SIZE) {
      // If the base record is too large, split it into shards
      console.warn(`Document ${doc._id} exceeds size limit. Sharding...`);
      records.push(...shardDocument(doc));
    } else {
      // Truncate the body field and add the record
      const truncatedBody = truncateOversizedField(doc.body || '', 9000); // Ensure body fits
      records.push({
        ...baseRecord,
        body: truncatedBody,
      });
    }
  });

  // Save all records to Algolia
  await algoliaClient.saveObjects({
    indexName,
    objects: records,
  });

  console.log("Initial indexing completed.");
  return {
    message: "Successfully completed initial indexing!",
  };
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const initialIndex = searchParams.get("initialIndex") === "true";

    // Perform initial indexing
    if (initialIndex) {
      const response = await performInitialIndexing();
      return NextResponse.json(response);
    }

     // Validate webhook signature
     const signature = request.headers.get(SIGNATURE_HEADER_NAME);
     if (!signature) {
       return NextResponse.json(
         { success: false, message: "Missing signature header" },
         { status: 401 }
       );
     }
 
     // Get request body for signature validation
     const body = await request.text(); 
     const isValid = await isValidSignature(body, signature, webhookSecret);
 
     if (!isValid) {
       return NextResponse.json(
         { success: false, message: "Invalid signature" },
         { status: 401 }
       );
     }

    // Incremental updates based on webhook payload
    let payload;
    try {
      payload = JSON.parse(body);
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
