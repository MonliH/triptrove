import React, { useEffect } from "react";
import {
  Flex,
  Center,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  Button,
  SlideFade,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { FormValues } from "../MultiStepForm";
import Zoom from "react-reveal/Zoom";

type FirstProps = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
  setDisabled: Dispatch<SetStateAction<boolean>>;
};

const First: React.FC<FirstProps> = ({ forms, setFormData, setDisabled }) => {
  const format = (val: string) => `$` + val;
  const parse = (val: string) => val.replace(/^\$/, "");

  useEffect(() => {
    if (forms.budget < 999) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [forms.budget]);

  const isError = forms.budget < 999;

  return (
    <>
      <FormControl isInvalid={isError}>
        <Flex direction="column" w="100%" align="center">
        <Text textAlign="left" fontWeight="bold" color="#54C4D6">
          Enter Your Budget:
        </Text>
          <NumberInput
            w="50rem"
            value={forms.budget ? format(forms.budget.toString()) : format("0")}
            width="50%"
            mt={2}
            onChange={(valueString: string) => {
              setFormData((f) => ({
                ...f,
                budget: parseInt(parse(valueString)),
              }));
            }}
            isRequired
          >
            <NumberInputField
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
              _hover={{
                outline: "none",
                border: "1px solid #ffffff",
                boxShadow: "none",
              }}
            />
          </NumberInput>
          {isError && (
            <FormErrorMessage>Budget must be at least $1000.</FormErrorMessage>
          )}
        </Flex>
      </FormControl>
    </>
  );
};

export default First;
