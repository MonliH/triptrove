import React, { useState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

import { FormValues } from "../MultiStepForm";
import Fade from "react-reveal/Fade";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ThirdProp = {
  forms: FormValues;
  setFormData: Dispatch<SetStateAction<FormValues>>;
  transition: boolean;
  timeout: Number;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  dates: { startDate: Date; endDate: Date };
  setDates: Dispatch<SetStateAction<{ startDate: Date; endDate: Date }>>;
};

const Third: React.FC<ThirdProp> = ({
  forms,
  setFormData,
  transition,
  timeout,
  setDisabled,
  dates,
  setDates
}) => {
  useEffect(() => {
    if (forms.adults && forms.startDate && forms.endDate) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [forms]);


  function formatDate(dateStr: string) {
    var newD = dateStr.toString().split(" ").slice(0, 4).join(" ");
    const dateObj = new Date(newD);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <Fade right>
      <Flex direction="column" align="center">
        <Flex direction="column" width="100%" mt={3}>
          <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center">
            How Many Adults?
          </Text>
          <NumberInput
            value={forms.adults}
            onChange={(e: any) => {
              setFormData((f) => ({ ...f, adults: parseInt(e || "0") }));
            }}
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
              fontSize={16}
              _focus={{
                // outline: "none",
                border: "1px solid #ffffff",
                boxShadow: "none",
              }}
              _hover={{
                outline: "none",
              }}
            />
          </NumberInput>
        </Flex>
        <Flex direction="column" width="100%" mt={3}>
          <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center">
            How Many Children?
          </Text>
          <NumberInput
            value={forms.children}
            onChange={(e: any) =>
              setFormData((f) => ({ ...f, children: parseInt(e || "0") }))
            }
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
              fontSize={16}
              _focus={{
                // outline: "none",
                border: "1px solid #ffffff",
                boxShadow: "none",
              }}
              _hover={{
                outline: "none",
              }}
            />
          </NumberInput>
        </Flex>
        <Flex direction="column" width="100%" mt={3}>
          <Text fontWeight={800} mb={1} color="#54C4D6" textAlign="center">
            When are you planning on going?
          </Text>
          <Flex direction="row" align="center">
            <Text mr={2}>From: </Text>
            <DatePicker
              className="date"
              format="yyyy-MM-dd"
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
              selected={dates.startDate}
              onChange={(date: any) => {
                setFormData({ ...forms, startDate: formatDate(date) });
                setDates({...dates, startDate:date});
              }}
            />
            <Text mr={2}>To:</Text>
            <DatePicker
              className="date"
              format="yyyy-MM-dd"
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
              selected={dates.endDate}
              onChange={(date: any) => {
                var newD = date.toString().split(" ").slice(0, 4).join(" ");
                const formattedDate = formatDate(newD);

                setFormData({ ...forms, endDate: formattedDate });
                setDates({...dates, endDate:date});
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Fade>
  );
};

export default Third;
