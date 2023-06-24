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

type FormValues = {
  continent: string;
  location: string;
  interests: string;
  adults: number;
  budget: number;
  children: number;
  startDate: string;
  endDate: string;
};

type ThirdProp = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
};

const Third: React.FC<ThirdProp> = ({ forms, setFormData }) => {
  return (
    <Flex direction="column" align="center">
      <Heading>Some Final Details</Heading>
      <Text mt={2}>Your almost there :)</Text>
      <Flex direction="column" width="100%" mt={3}>
        <Text>How Many Children?</Text>
        <NumberInput>
          <NumberInputField
            onChange={(e: any) =>
              setFormData({ ...forms, adults: parseInt(e.target.value) })
            }
          />
        </NumberInput>
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text>How Many Adults?</Text>
        <NumberInput>
          <NumberInputField
            onChange={(e: any) =>
              setFormData({ ...forms, children: parseInt(e.target.value) })
            }
          />
        </NumberInput>
      </Flex>
      <Flex direction="column" width="100%" mt={3}>
        <Text>When are you planning on going?</Text>
        <Flex direction="row" align="center">
          <Text mr={2}>From </Text>
          <Input
            w="50%"
            type="datetime-local"
            mr={2}
            onChange={(e: any) => {
              setFormData({
                ...forms,
                startDate: e.target.value.split("T")[0],
              });
            }}
          />
          <Text mr={2}>To:</Text>
          <Input
            w="50%"
            type="datetime-local"
            mr={2}
            onChange={(e: any) => {
              setFormData({ ...forms, endDate: e.target.value.split("T")[0] });
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Third;
