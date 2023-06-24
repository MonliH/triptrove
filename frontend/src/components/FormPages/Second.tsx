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
      setFormData(place);
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
        transition:"0.5s"
      }}
     
    >
      <Flex direction="column" width="100%" mt={3}>
        <Text>Enter Your Location</Text>
        <Input ref={ref} style={{ width: "90%" }} defaultValue="Amsterdam" />
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text>What kind of trip would you like this to be?</Text>
        <Input
          style={{ width: "90%" }}
          defaultValue="What kind of Trip? i.e. relaxation"
          value={forms.interests}
          onChange={(e: any) => {
            setFormData({
              ...forms,
              interests: e.target.value,
            });
          }}
        />
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text>What Continent Would You like to visit?</Text>
        <Select
          style={{ width: "90%" }}
          placeholder="Continent"
          onChange={(e: any) => {
            setFormData({ ...forms, continent: e.target.value });
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
