import Head from "next/head";
import { Heading } from "@chakra-ui/react";
import Main from "@/components/Main";
import MultiStepForm from "@/components/MultiStepForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Trip Trove: Budget Your Adventure</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main>
        <MultiStepForm />
      </main>
    </>
  );
}
