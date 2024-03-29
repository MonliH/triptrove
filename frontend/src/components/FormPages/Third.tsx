import React, { forwardRef, useState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  Box,
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
};

function addDays(d: Date, days: number) {
  d.setDate(d.getDate() + days);
  return d;
}

const Third: React.FC<ThirdProp> = ({
  forms,
  setFormData,
  transition,
  timeout,
  setDisabled,
  dates,
}) => {
  useEffect(() => {
    if (forms.adults && forms.startDate && forms.endDate) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [forms]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    try {
      if (forms.startDate) setStartDate(new Date(forms.startDate));
      if (forms.endDate) setEndDate(new Date(forms.endDate));
    } catch {
      setStartDate(null);
      setEndDate(null);
    }
  }, []);

  const customInput = (
    <Input
      boxShadow="0px 2px 3px #ccc"
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
    ></Input>
  );

  return (
    <Box zIndex="999">
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
            <DatePicker
              className="date"
              selected={startDate}
              startDate={startDate}
              popperPlacement="bottom"
              endDate={endDate}
              selectsRange
              customInput={customInput}
              minDate={new Date()}
              maxDate={startDate ? addDays(new Date(startDate), 30) : undefined}
              onChange={([start, end]: [Date, Date]) => {
                onChange([start, end]);
                setFormData({
                  ...forms,
                  startDate: start.toISOString().split("T")[0],
                  endDate: end ? end.toISOString().split("T")[0] : "",
                });
              }}
            />
          </Flex>
        </Flex>
      </Fade>
    </Box>
  );
};

export default Third;
