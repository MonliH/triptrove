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
      mt={10}
      alignContent={"center"}
      justifyContent={"center"}
      direction="column"
      w="100%"
      align="center"
    >
      <Text fontWeight={800}  color="#54C4D6" mt={2}>Enter Your Budget:</Text>
      <NumberInput
        boxShadow=" 0px 2px 3px #ccc"
        borderBottom="0.25em solid #c6be9f"
        borderTop="1px solid #ffffff"
        bg="#ffffff"
        outline="none"
        borderColor="transparent"
        borderRadius="20px"
        outlineColor="transparent"
        _focus={{
          outline: "none",
          border: "1px solid #ffffff",
          boxShadow: "none",
        }}
        //placeholder="Enter Your Budget"
        value={forms.budget ? format(forms.budget.toString()) : format("0")}
        width="50%"
        mt={2}
        onChange={(valueString: string) => {
          setFormData({
            ...forms,
            budget: parseInt(parse(valueString)),
          });
        }}
        isRequired
      >
        <NumberInputField
               userSelect="none"
          w="80%"
          borderRadius="50%"
          _focus={{
            outline: "none",
            border: "1px solid #ffffff",
            boxShadow: "none",
          }}
          _hover={{
            outline: "none",
            border: "1px solid #ffffff",
            boxShadow: "none",
          }}
        />
      </NumberInput>
    </Flex>
  );
};

export default First;
