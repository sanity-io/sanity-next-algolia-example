import { NextResponse } from 'next/server';
import { algoliasearch } from "algoliasearch";
import { createClient } from '@sanity/client';

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!;
const sanityProjectId = process.env.SANITY_PROJECT_ID!;
const sanityDataset = process.env.SANITY_DATASET!;

const algoliaClient = algoliasearch(algoliaAppId, algoliaApiKey);

const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: '2021-03-25',
  useCdn: false,
});

export async function POST() {
  try {
    const sanityData = await sanityClient.fetch(`*[_type == "post"]{
      _id,
      title,
      "path": slug.current,
      "body": pt::text(content)
    }`);

    const records = sanityData.map((doc: any) => ({
      objectID: doc._id,
      title: doc.title,
      path: doc.path,
      body: doc.content,
    }));

    // Use `saveObjects` with `indexName` in Algolia v5
    await algoliaClient.saveObjects({
      indexName: 'my-index',
      objects: records,
    });

    return NextResponse.json({ message: 'Successfully indexed objects!' });
  } catch (error) {
    console.error('Error indexing objects:', error);
    return NextResponse.json(
      { error: 'Error indexing objects', details: error },
      { status: 500 }
    );
  }
}