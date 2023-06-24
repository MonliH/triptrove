import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import {
  Flex,
  Heading,
  Text,
  Input,
  Select,
  HStack,
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Button,
} from "@chakra-ui/react";
import { usePlacesWidget } from "react-google-autocomplete";

import { FormValues, IMAGE_CDN } from "../MultiStepForm";
import Fade from "react-reveal/Fade";
import { X } from "react-feather";

import debounce from "lodash.debounce";

type SecondProps = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
  transition: boolean;
  timeout: Number;
  setDisabled: Dispatch<SetStateAction<boolean>>;
};
const transitions = {
  entering: {
    display: "block",
  },
  entered: {
    opacity: 1,
    display: "block",
  },
  exiting: {
    opacity: 0,
    display: "block",
  },
  exited: {
    opacity: "0",
    display: "none",
  },
};

interface Auto {
  cityName: string;
  countryName: string;
  imageUrl: string;
  ufi: number;
}

const Second: React.FC<SecondProps> = ({
  forms,
  setFormData,
  transition,
  timeout,
  setDisabled,
}) => {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
    onPlaceSelected: (place) => {
      setFormData((f) => ({ ...f, ...place }));
    },
    options: {
      types: ["(cities)"],
    },
  });

  useEffect(() => {
    if (
      forms.formatted_address &&
      forms.interests &&
      (forms.continent || forms.city)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [forms]);

  useEffect(() => {
    (ref.current as unknown as HTMLInputElement).value =
      forms.formatted_address || "";
  }, []);

  const [query, setQuery] = useState<string>("");
  const [autocomplete, setAutocomplete] = useState<Auto[]>();
  const updateAutoComplete = debounce((query: string) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/destinations?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAutocomplete(data);
      });
  }, 200);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    updateAutoComplete(event.target.value);
  };

  const [show, setShowAuto] = useState<boolean>(false);

  return (
    <Fade right>
      <Flex direction="column" align="center" justify="centert">
        <Flex direction="column" width="100%" mt={3}>
          <Text fontWeight={400} mb={1} color="#54C4D6" textAlign="center">
            Enter Your City of Departure:
          </Text>
          <Input
            boxShadow=" 0px 2px 3px #ccc"
            borderBottom="0.25em solid #c6be9f"
            borderTop="1px solid #ffffff"
            bg="#ffffff"
            outline="none"
            borderColor="transparent"
            borderRadius="20px"
            outlineColor="transparent"
            _focus={{
              // outline: "none",
              border: "1px solid #ffffff",
              boxShadow: "none",
            }}
            _hover={{
              outline: "none",
            }}
            ref={ref as any}
          />
        </Flex>
        <Flex direction="column" width="100%" mt={3}>
          <Text fontWeight={400} mb={1} color="#54C4D6" textAlign="center">
            My goals and wishes for this trip are...
          </Text>
          <Input
            boxShadow=" 0px 2px 3px #ccc"
            borderBottom="0.25em solid #c6be9f"
            borderTop="1px solid #ffffff"
            bg="#ffffff"
            outline="none"
            borderColor="transparent"
            borderRadius="20px"
            outlineColor="transparent"
            fontSize={16}
            _focus={{
              // outline: "none",
              border: "1px solid #ffffff",
              boxShadow: "none",
            }}
            _hover={{
              outline: "none",
            }}
            placeholder="have fun and relax"
            value={forms.interests}
            onChange={(e: any) => {
              setFormData((f) => ({
                ...f,
                interests: e.target.value,
              }));
            }}
          />
        </Flex>
        <Flex direction="column" width="100%" mt={3}>
          <HStack>
            <Flex direction="column">
              <Text fontWeight={400} mb={1} color="#54C4D6" textAlign="center">
                What city do you want to visit?
              </Text>
              <InputGroup position="relative">
                <Input
                  onChange={handleChange}
                  value={query}
                  boxShadow=" 0px 2px 3px #ccc"
                  borderBottom="0.25em solid #c6be9f"
                  borderTop="1px solid #ffffff"
                  bg="#ffffff"
                  outline="none"
                  borderColor="transparent"
                  borderRadius="20px"
                  outlineColor="transparent"
                  onFocus={() => setShowAuto(true)}
                  onBlur={() => setShowAuto(false)}
                  _focus={{
                    borderBottom: "0.25em solid #c6be9f",
                    borderTop: "1px solid #ffffff",
                    outline: "none",
                    borderColor: "transparent",
                  }}
                  _hover={{
                    outline: "none",
                  }}
                />
                <InputRightElement>
                  <IconButton
                    bgColor="transparent"
                    size="xs"
                    aria-label="X"
                    icon={<X size={18} />}
                    onClick={() => {
                      setQuery("");
                      setAutocomplete([]);
                    }}
                  ></IconButton>
                </InputRightElement>
                <Box
                  position="absolute"
                  bgColor="white"
                  borderRadius="md"
                  p="3"
                  w="300px"
                  top="50"
                  h="fit-content"
                >
                  <Text>Destinations</Text>
                  {autocomplete &&
                    autocomplete.map((auto) => {
                      return (
                        <HStack
                          mb="3"
                          cursor="pointer"
                          onClick={() => {
                            console.log("hi");
                            setFormData((f) => ({
                              ...f,
                              city: auto.cityName,
                              continent: null,
                            }));
                          }}
                        >
                          <Image
                            src={`${IMAGE_CDN}${auto.imageUrl}`}
                            width="50px"
                            height="50px"
                            borderRadius="3"
                          />
                          <Box>
                            <Text>{auto.cityName}</Text>
                            <Text fontSize="xs" mt="-1">
                              {auto.country}
                            </Text>
                          </Box>
                        </HStack>
                      );
                    })}
                </Box>
              </InputGroup>
            </Flex>
            <Box
              h="32"
              borderLeft="1px solid"
              borderColor="black"
              position="relative"
              mx="5"
            >
              <Text
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                left="-2"
                bgColor="#FFEEAD"
              >
                or
              </Text>
            </Box>
            <Flex direction="column">
              <Text fontWeight={400} mb={1} color="#54C4D6" textAlign="center">
                Not sure which city? Choose a continent <br></br>and we'll pick
                for you!
              </Text>
              <Select
                boxShadow=" 0px 2px 3px #ccc"
                borderBottom="0.25em solid #c6be9f"
                borderTop="1px solid #ffffff"
                bg="#ffffff"
                outline="none"
                borderColor="transparent"
                borderRadius="20px"
                outlineColor="transparent"
                _focus={{
                  borderBottom: "0.25em solid #c6be9f",
                  borderTop: "1px solid #ffffff",
                  outline: "none",
                  borderColor: "transparent",
                }}
                _hover={{
                  outline: "none",
                }}
                defaultValue={"Europe"}
                placeholder="Select a continent"
                value={forms.continent ?? undefined}
                onChange={(e: any) => {
                  setFormData((f) => ({ ...f, continent: e.target.value }));
                }}
              >
                <option value="na">North America</option>
                <option value="sa">South America</option>
                <option value="asia">Asia</option>
                <option value="europe">Europe</option>
                <option value="africa">Africa</option>
                <option value="oceania">Oceania</option>
                <option value="carribbean">Carribbean</option>
                <option value="middleEast">Middle East</option>
              </Select>
            </Flex>
          </HStack>
        </Flex>
      </Flex>
    </Fade>
  );
};

export default Second;
