import React, { Fragment, useState } from "react";
import {
  Flex,
  Center,
  Heading,
  Text,
  Input,
  Button,
  Box,
  Skeleton,
  HStack,
} from "@chakra-ui/react";
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

  const [flights, setFlights] = useState<null | {
    details: any[];
    price: number;
  }>(null);
  const [loadingFlights, setLoadingFlights] = useState(false);

  function handleSubmit() {
    //...stuff
    if (page != 2) {
      setPage(page + 1);
    } else {
      console.log(formData);
      (async () => {
        setLoadingFlights(true);
        setFlights(null);
        const from = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/flightDestinations?query=${encodeURIComponent(
            formData.formatted_address.split(",")[0]
          )}`
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
          {
            method: "POST",
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
            }),
          }
        ).then((response) => response.json());

        if (flight.length == 0) {
          setFlights({ details: [], price: 0 });
        } else {
          console.log(flight);
          setFlights(flight);
        }
        setLoadingFlights(false);
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
      {(loadingFlights || flights !== null) && (
        <Box>
          <Skeleton isLoaded={flights !== null}>
            <Heading>Flight</Heading>
          </Skeleton>
          <Skeleton isLoaded={flights !== null}>
            {flights && flights.details.length > 0 ? (
              <Box>
                {flights.details.map((flight, i) => {
                  const departDate = new Date(flight.departureTime);
                  const arriveDate = new Date(flight.arrivalTime);
                  const carrier = flight.legs[0].carriersData[0];

                  return (
                    <Box key={i}>
                      <HStack>
                        <Box mr="4">
                          <img src={carrier.logo}></img>
                          <Text>{carrier.name}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="4xl">
                            {departDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </Text>
                          <HStack>
                            <Text>{flight.legs[0].departureAirport.code}</Text>
                            <Box w={1} h={1} bg="black" borderRadius="50%" />
                            <Text>
                              {departDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </Text>
                          </HStack>
                        </Box>
                        <Box w={40} border="1px solid" borderColor="gray.300" mx="5"></Box>
                        <Box>
                          <Text fontSize="4xl">
                            {arriveDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </Text>
                          <HStack>
                            <Text>
                              {
                                flight.legs[flight.legs.length - 1]
                                  .arrivalAirport.code
                              }
                            </Text>
                            <Box w={1} h={1} bg="black" borderRadius="50%" />
                            <Text>
                              {arriveDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Text>
                No flights found. Don't worry! We've still put together a plan
                with activies to do there.
              </Text>
            )}
          </Skeleton>
        </Box>
      )}
    </Flex>
  );
};
export default MultiStepForm;
