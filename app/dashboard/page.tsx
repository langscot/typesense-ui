"use client";

import { AppPage } from "@/components/app-page";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useManageConnections } from "@/lib/typesense/typesense-store";
import Link from "next/link";

const examples = [
  {
    title: "Recipe Search",
    description:
      "A site that showcases Typesense in action on a 2 Million recipe database, with the ability to filter by ingredients.",
    dataSize: "2 Million recipes",
    demoUrl: "https://recipe-search.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-recipe-search",
  },
  {
    title: "Linux Commit History Search",
    description:
      "A site that indexes 1M linux commit messages in Typesense and lets you browse, search and filter through the commits.",
    dataSize: "1 Million commits",
    demoUrl: "https://linux-commits-search.typesense.org/",
    codeRepositoryUrl:
      "https://github.com/typesense/showcase-linux-commits-search",
  },
  {
    title: "E-commerce Store Browsing Experience",
    description:
      "A site that showcases how to build an e-commerce storefront browsing experience with Typesense.",
    dataSize: "3K products",
    demoUrl: "https://ecommerce-store.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-ecommerce-store",
  },
  {
    title: "E-commerce Storefront with Next.js + Typesense + Vercel",
    description:
      "A site that showcases how to build an e-commerce storefront browsing experience with Typesense and Next.js.",
    dataSize: "3K products",
    demoUrl: "https://showcase-nextjs-typesense-ecommerce-store.vercel.app/",
    codeRepositoryUrl:
      "https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store",
  },
  {
    title: "xkcd comic search",
    description:
      "A site that lets you search xkcd comics by topic, with data indexed in Typesense",
    dataSize: "~2.5K comics",
    demoUrl: "https://findxkcd.com/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-xkcd-search",
  },
  {
    title: "Books Search",
    description:
      "A site that showcases Typesense in action on a 28 Million books database from OpenLibrary, with the ability to filter by authors and subject.",
    dataSize: "28 Million books",
    demoUrl: "https://books-search.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-books-search",
  },
  {
    title: "MusicBrainz Songs Search",
    description:
      "A site that showcases Typesense in action on a 32 Million Songs database from MusicBrainz.",
    dataSize: "32 Million songs",
    demoUrl: "https://songs-search.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-songs-search",
  },
  {
    title: "Typeahead Spellchecker",
    description:
      "A widget that mimics the typeahead spellcheckers on Android / iPhone keyboards.",
    dataSize: "333K english words",
    demoUrl: "https://spellcheck.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-spellcheck",
  },
  {
    title: "2020 US Presidential Candidates' Speeches Search",
    description:
      "Instant Search speeches of US Presidential Candidates side-by-side.",
    dataSize: "15K utterances",
    demoUrl: "https://biden-trump-speeches-search.typesense.org/",
    codeRepositoryUrl: "https://biden-trump-speeches-search.typesense.org/",
  },
  {
    title: "Federated Search",
    description: "A site that showcases Typesense's Federated Search feature.",
    dataSize: "10K usernames and 10K company names",
    demoUrl: "https://federated-search.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-federated-search",
  },
  {
    title: "AirBnB Geo Search",
    description: "A site that showcases Typesense's Geo Search feature.",
    dataSize: "1.2M AirBnB listings",
    demoUrl: "https://airbnb-geosearch.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-airbnb-geosearch",
  },
  {
    title: "Airports Geo Search",
    description:
      "A site that showcases Typesense's Geo Search feature with Next.js and react-instantsearch.",
    dataSize: "78K Airports around the world",
    demoUrl: "https://airports-geosearch.typesense.org/",
    codeRepositoryUrl:
      "https://github.com/typesense/showcase-airports-geosearch",
  },
  {
    title: "Semantic Search + Hybrid Search",
    description:
      "A site that showcases Typesense's semantic search and hybrid search features, along with the auto-embedding generation feature.",
    dataSize: "300K Comments from HackerNews",
    demoUrl: "https://hn-comments-search.typesense.org/",
    codeRepositoryUrl: "https://hn-comments-search.typesense.org/",
  },
  {
    title: "NuxtJS",
    description:
      "Sites that showcase how to use Typesense in different Javascript frameworks.",
    dataSize: "2141 chord shapes of 552 chords",
    demoUrl: "https://guitar-chords-search-nuxt-js.typesense.org/",
    codeRepositoryUrl:
      "https://github.com/typesense/showcase-guitar-chords-search-nuxt-js",
  },
  {
    title: "Address autocomplete",
    description: "An address autocomplete experience powered by Typesense.",
    dataSize: "15K addresses in Boston city",
    demoUrl: "https://address-autocomplete.typesense.org/",
    codeRepositoryUrl:
      "https://github.com/typesense/showcase-address-autocomplete",
  },
  {
    title: "AI Image Search",
    description: "A site that showcases Typesense's Image Search feature.",
    dataSize: "1.25K images",
    demoUrl: "https://ai-image-search.typesense.org/",
    codeRepositoryUrl: "https://github.com/typesense/showcase-ai-image-search",
  },
  {
    title: "Conversational Search",
    description:
      "A site that showcases Typesense's Conversational Search feature.",
    dataSize: "220 essays",
    demoUrl: "https://conversational-search-pg-essays.typesense.org/",
    codeRepositoryUrl:
      "https://github.com/typesense/showcase-conversational-search-pg-essays",
  },
];

export default function DashboardPage() {
  const { activeConnectionId } = useManageConnections();

  return (
    <AppPage
      breadcrumbs={
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <div className="flex flex-col items-center justify-center w-full my-24">
        <h1 className="text-2xl font-bold text-center">
          What will you build next?
        </h1>

        <div className="mt-12 grid grid-cols-2 gap-4 mt-4 w-full max-w-2xl">
          {examples.map((example) => (
            <Card
              key={example.title}
              className="flex flex-col justify-between shadow-none"
            >
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
                <CardDescription>{example.dataSize}</CardDescription>
              </CardHeader>
              <CardFooter>
                <CardAction className="flex gap-2">
                  <Link href={example.codeRepositoryUrl} target="_blank">
                    <Button variant="outline">View Code</Button>
                  </Link>
                  <Link href={example.demoUrl} target="_blank">
                    <Button variant="default">View Demo</Button>
                  </Link>
                </CardAction>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppPage>
  );
}
