import React from "react";
import { Dispatch, SetStateAction } from "react";
import { Flex, Heading, Text, Input, Select } from "@chakra-ui/react";
import { usePlacesWidget } from "react-google-autocomplete";

import { FormValues } from "../MultiStepForm";

type SecondProps = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
  transition: boolean;
  timeout: Number;
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

const Second: React.FC<SecondProps> = ({
  forms,
  setFormData,
  transition,
  timeout,
}) => {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
    onPlaceSelected: (place) => {
      setFormData(f => ({...f, ...place}));
    },
    options: {
      types: ["(regions)"],
    },
  });

  return (
    <Flex
      direction="column"
      align="center"
      justify="centert"
      style={{
        transition: "0.5s",
      }}
    >
      <Flex direction="column" width="100%" mt={3}>
        <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center">
          Enter Your Location:
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
        <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center">My goals and wishes for this trip are...</Text>
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
            setFormData(f => ({
              ...f,
              interests: e.target.value,
            }));
          }}
        />
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center" >What Continent Would You like to visit?</Text>
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
           // outline: "none",
           border: "1px solid #ffffff",
           boxShadow: "none",
         }}
         _hover={{
           outline: "none",
         }}
          placeholder="Continent"
          onChange={(e: any) => {
            setFormData(f => ({ ...f, continent: e.target.value }));
          }}
        >
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Asia">Asia </option>
          <option value="Europe">Europe </option>
          <option value="Africa">Africa </option>
          <option value="Oceania">Oceania </option>
        </Select>
      </Flex>
    </Flex>
  );
};

export default Second;
