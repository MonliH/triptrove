import "@/styles/globals.css";
import { ChakraProvider,extendTheme  } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "./theme";
import "@/styles/custom.css"



export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
