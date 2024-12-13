'use client';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { SearchBox, Hits } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { useState } from 'react';
import Link from 'next/link';

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!;

const searchClient = algoliasearch(algoliaAppId, algoliaApiKey);

export function Search() {

    const [results, setResults] = useState('');

    return (
        <InstantSearchNext
            indexName="my-index"
            searchClient={searchClient}
            initialUiState={{
                'my-index': { query: '' },
            }}
            onStateChange={({ uiState }) => {
                setResults(uiState['my-index']?.query || '');
            }}
            future={{ preserveSharedStateOnUnmount: true }}
            routing={{
                router: {
                    cleanUrlOnDispose: false,
                    windowTitle(routeState) {
                        const indexState = routeState.indexName || {};
                        return indexState.query
                            ? `MyWebsite - Results for: ${indexState.query}`
                            : 'MyWebsite - Results page';
                    },
                }
            }}
        >
            {/* SearchBox for input */}
            <SearchBox
                placeholder="Search for items..."
                classNames={{
                    input: 'border p-2 rounded border-gray-300 m-5 w-1/2',
                    submit: 'hidden',
                    reset: 'hidden',
                }}
            />

            {/* Hits component to display results */}
            {results && (
                <div className="text-left">
                    <h2 className="text-2xl font-semibold">Results for: {results}</h2>

                    <Hits
                        hitComponent={({ hit }) => (
                            <div className="p-2 border-b">
                                <Link href={`/posts/${hit.slug}`} passHref className='text-red-500 hover:text-red-600 hover:underline'>
                                    {hit.title}
                                </Link>
                                <p>{hit.description}</p>
                            </div>
                        )}
                    />
                </div>
            )}
        </InstantSearchNext>
    );
}
