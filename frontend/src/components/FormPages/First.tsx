import React from "react";
import {
  Flex,
  Center,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  Button,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { FormValues } from "../MultiStepForm";

type FirstProps = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
};

const First: React.FC<FirstProps> = ({ forms, setFormData }) => {
  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  return (
    <Flex
      mt={20}
      alignContent={"center"}
      justifyContent={"center"}
      direction="column"
      w="100%"
      align="center"
    >
      <Heading>Welcome!</Heading>
      <Text mt={2}>Enter Your Budget</Text>
      <NumberInput
        //placeholder="Enter Your Budget"
        value={forms.budget? format(forms.budget.toString()) : format("0")}
        width="50%"
        mt={2}
        onChange={(valueString:string) => {
          setFormData({
            ...forms,
            budget: parseInt(parse(valueString)),
          });
        }}
        isRequired
      >
        <NumberInputField />
      </NumberInput>
    </Flex>
  );
};

export default First;
