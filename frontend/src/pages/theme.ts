import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    styles: {
      global: () => ({
        body: {
          bg: "#FFEEAD",
        }
      })
    },
  })
  export default theme