import "@/styles/globals.css";
import { ChakraProvider  } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "../lib/theme";
import "@/styles/custom.css"



export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
