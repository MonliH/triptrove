import React from "react";
import { Dispatch, SetStateAction } from "react";
import {
  Flex,
  Heading,
  Text,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

import { FormValues } from "../MultiStepForm";

type ThirdProp = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
  transition:boolean;
  timeout:Number;
};

const Third: React.FC<ThirdProp> = ({ forms, setFormData,transition,timeout }) => {
  return (
    <Flex direction="column" align="center">
      <Flex direction="column" width="100%" mt={3}>
        <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center" >How Many Children?</Text>
        <NumberInput>
          <NumberInputField
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
            onChange={(e: any) =>
              setFormData(f => ({ ...f, adults: parseInt(e.target.value) }))
            }
          />
        </NumberInput>
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center" >How Many Adults?</Text>
        <NumberInput>
          <NumberInputField
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
            onChange={(e: any) =>
              setFormData(f => ({ ...f, children: parseInt(e.target.value) }))
            }
          />
        </NumberInput>
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center" >When are you planning on going?</Text>
        <Flex direction="row" align="center">
          <Text mr={2}>From </Text>
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
            w="50%"
            type="datetime-local"
            mr={2}
            onChange={(e: any) => {
              setFormData(f => ({
                ...f,
                startDate: e.target.value.split("T")[0],
              }));
            }}
          />
          <Text mr={2}>To:</Text>
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
            w="50%"
            type="datetime-local"
            mr={2}
            onChange={(e: any) => {
              setFormData(f => ({ ...f, endDate: e.target.value.split("T")[0] }));
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Third;
