import "@/styles/globals.css";
import { ChakraProvider,extendTheme  } from "@chakra-ui/react";
import type { AppProps } from "next/app";

const theme = extendTheme({
  colors: {
    brand: {
      50:"#212B43" // you need this
    }
  }
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
