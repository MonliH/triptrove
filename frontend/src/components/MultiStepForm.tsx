import React, { useState } from "react";
import { Flex, Center, Heading, Text, Input, Button } from "@chakra-ui/react";
import First from "./FormPages/First";
import Second from "./FormPages/Second";
import Third from "./FormPages/Third";

export interface FormValues {
  continent: string;
  formatted_address: string;
  interests: string;
  adults: number;
  budget: number;
  children: number;
  startDate: string;
  endDate: string;
}

const MultiStepForm: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>({
    continent: "",
    formatted_address: "",
    interests: "",
    adults: 0,
    children: 0,
    budget: 0,
    startDate: "",
    endDate: "",
  });

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return <First forms={formData} setFormData={setFormData} />;
      case 1:
        return <Second forms={formData} setFormData={setFormData} />;
      case 2:
        return <Third forms={formData} setFormData={setFormData} />;
      default:
        return <First forms={formData} setFormData={setFormData} />;
    }
  };
  function handleSubmit() {
    //...stuff
    if (page != 2) {
      setPage(page + 1);
    } else {
      console.log(formData);
      (async () => {
        const from = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/flightDestinations?query=${encodeURIComponent(formData.formatted_address.split(",")[0])}`
        ).then((response) => response.json());
        const to = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/flightDestinations?query=paris`
        ).then((response) => response.json());

        const fromCity = from.find((e: any) => e.type == "CITY");
        const fromAirport = from.find((e: any) => e.type == "AIRPORT");
        const toCity = to.find((e: any) => e.type == "CITY");
        const toAirport = to.find((e: any) => e.type == "AIRPORT");

        const flight = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/flightsToDestination`,
          {method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
          fromLocation: fromAirport,
          toLocation: toAirport,
          adults: formData.adults,
          children: formData.children,
          departDate: formData.startDate,
          returnDate: formData.endDate,
          })
          }
        ).then((response) => response.json());
        console.log(flight);
      })();
    }
  }

  const [page, setPage] = useState(0);

  return (
    <Flex direction="column" align="center" h="100vh">
      {conditionalComponent()}
      <Flex direction="row" align="center" justify="space-evenly" d="flex">
        {page > 0 && (
          <Button w={20} mt={3} onClick={() => setPage(page - 1)}>
            Back
          </Button>
        )}
        <Button onClick={handleSubmit} w={20} mt={3} ml={3}>
          {page === 0 || page === 1 ? "Next" : "Submit"}
        </Button>
      </Flex>
    </Flex>
  );
};
export default MultiStepForm;
