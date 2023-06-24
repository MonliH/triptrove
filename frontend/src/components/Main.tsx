import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import debounce from "lodash.debounce";

interface Auto {
  cityName: string;
  countryName: string;
  imageUrl: string;
  ufi: number;
}

export default function Main() {
  const [query, setQuery] = useState<string>("");
  const [autocomplete, setAutocomplete] = useState<Auto[]>();
  const updateAutoComplete = debounce((query: string) => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/flightDestinations?query=${query}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAutocomplete(data);
      });
  }, 200);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    updateAutoComplete(event.target.value);
  };

  const [activeUfi, setActiveUfi] = useState<number | null>(null);
  console.log(autocomplete);

  return (
    <Box pt="32" px="64">
      <form onSubmit={() => {}}>
        <FormControl>
          <FormLabel>Where do you want to go?</FormLabel>
          <HStack>
            <Input placeholder="e.g., Paris" onChange={handleChange} />
          </HStack>
          <Box>
            {autocomplete?.map((auto, i) => (
              <Box key={auto.ufi}>
                {i != 0 && <Divider />}
                <Box py="2">
                  <Text>{auto.cityName}</Text>
                  <Text>{auto.countryName}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </FormControl>
      </form>
    </Box>
  );
}
