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
  Spacer,
  Image,
  Link,
  VStack,
} from "@chakra-ui/react";
import First from "./FormPages/First";
import Second from "./FormPages/Second";
import Third from "./FormPages/Third";
import End from "./FormPages/End";
import { placeholderAttraction } from "@/lib/placeholder";

const IMAGE_CDN = "https://cf2.bstatic.com";

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

type Attractions = { ID: string; Date: string; Justification: string }[];
export type AttractionsReq = {
  bookings: Record<string, any>;
  schedule: Record<string, Attractions>;
};

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
  const [transitionState, setTransitionState] = useState(false);

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return <First forms={formData} setFormData={setFormData} />;
      case 1:
        return (
          <Second
            forms={formData}
            setFormData={setFormData}
            transition={transitionState}
            timeout={300}
          />
        );
      case 2:
        return (
          <Third
            forms={formData}
            setFormData={setFormData}
            transition={transitionState}
            timeout={300}
          />
        );
      // case 3:
      //   return <End loading={loadingFlights} />;
      default:
        return <First forms={formData} setFormData={setFormData} />;
    }
  };

  const [flights, setFlights] = useState<null | {
    details: any[];
    info: any;
    price: number;
  }>(null);
  const [loadingFlights, setLoadingFlights] = useState(false);

  const [attractions, setAttractions] = useState<null | AttractionsReq>(null);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  const destination = "paris";

  const [hotel, setHotel] = useState<null | any>(null);
  const [loadingHotel, setLoadingHotel] = useState(false);

  const startDate = formData.startDate.split('T')[0];
  const endDate = formData.endDate.split('T')[0];

  function handleSubmit() {
    //...stuff
    if (page != 2) {
      setPage(page + 1);
      setTransitionState(!transitionState);
    } else {
      // setPage(page + 1);
      (async () => {
        setLoadingFlights(true);
        setFlights(null);
        setLoadingAttractions(true);
        setAttractions(null);
        setHotel(null);
        setLoadingHotel(true);
        const from = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/flightDestinations?query=${encodeURIComponent(
            formData.formatted_address.split(",")[0]
          )}`
        ).then((response) => response.json());
        const to = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/flightDestinations?query=${destination}`
        ).then((response) => response.json());

        const fromCity = from.find((e: any) => e.type == "CITY");
        const fromAirport = from.find((e: any) => e.type == "AIRPORT");
        const toCity = to.find((e: any) => e.type == "CITY");
        const toAirport = to.find((e: any) => e.type == "AIRPORT");

        (async () => {
          const toInfo = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/destinations?query=${destination}`
          ).then((response) => response.json());
          const toLocationUfi = toInfo[0].ufi;

          (async () => {
            const hotel = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/hotels`,
              {
                method: "POST",
                body: JSON.stringify({
                  adults: formData.adults,
                  children: formData.children,
                  departDate: startDate,
                  returnDate: endDate,
                  maxPrice:
                    (formData.budget * 0.3) /
                    ((new Date(endDate).getTime() -
                      new Date(startDate).getTime()) /
                      (1000 * 60 * 60 * 24)),
                  ufi: toLocationUfi,
                  cityName: toInfo[0].cityName,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            ).then((response) => response.json());
            setHotel(hotel);
            setLoadingHotel(false);
          })();

          const attractions = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/results?ufi=${toLocationUfi}&personalization=${encodeURIComponent(
              "My goals and wishes for this trip are " +
                formData.interests +
                ". I am travelling with " +
                formData.children
                ? formData.children
                : "no" + " children and " + formData.adults
                ? formData.adults
                : "no" + " adults."
            )}&end_date=${endDate}&start_date=${startDate}`
          ).then((response) => response.json());

          setAttractions(attractions);
          setLoadingAttractions(false);
        })();

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
              departDate: startDate,
              returnDate: endDate,
            }),
          }
        ).then((response) => response.json());

        if (flight.length == 0) {
          setFlights({ details: [], info: null, price: 0 });
        } else {
          setFlights(flight);
        }
        setLoadingFlights(false);
      })();
    }
  }

  const [page, setPage] = useState(0);
  console.log(hotel);

  return (
    <Flex direction="column" align="center"  justify="center">
      <VStack direction="column" w="full" h="100vh" align="center" justify="center">
      <Heading fontSize="5xl">TripTrove</Heading>
      <Text mt={2}>Discover Your Next Trip</Text>
      {conditionalComponent()}
      <Flex
        direction="row"
        align="center"
        justify="space-evenly"
        display="flex"
      >
        {page > 0 && page < 3 && (
          <button
          className="pushable back"
            onClick={() => setPage(page - 1)}
          >
             <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">
            Back
            </span>
          </button>
        )}
        {page < 3 && (
          <button onClick={handleSubmit} className="pushable">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">
              {page === 0 || page === 1 ? "Next" : "Submit"}
            </span>
          </button>
        )}
      </Flex>
      </VStack>
      <Box w={"min(800px,95vw)"}>
        {(loadingFlights || flights !== null) && (
          <Box mb="4">
            <Skeleton isLoaded={flights !== null}>
              <HStack>
                <Heading>Flight</Heading>
                <Spacer />
                {flights && flights.details.length > 0 && (
                  <Text fontSize="2xl">${flights.price}</Text>
                )}
              </HStack>
            </Skeleton>
            <Skeleton isLoaded={flights !== null}>
              {flights && flights.details.length > 0 ? (
                <Box>
                  {flights.details.map((flight, i) => {
                    const departDate = new Date(flight.departureTime);
                    const arriveDate = new Date(flight.arrivalTime);
                    const carrier = flight.legs[0].carriersData[0];

                    return (
                      <Box key={i + " flights"}>
                        <HStack>
                          <Box mr="7">
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
                              <Text>
                                {flight.legs[0].departureAirport.code}
                              </Text>
                              <Box w={1} h={1} bg="black" borderRadius="50%" />
                              <Text>
                                {departDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </Text>
                            </HStack>
                          </Box>
                          <Box
                            w={40}
                            border="1px solid"
                            borderColor="gray.300"
                            mx="5"
                          ></Box>
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
        {(loadingHotel || hotel !== null) && (
          <Skeleton isLoaded={hotel !== null}>
            <Box>
              <HStack>
                <Heading>Hotel</Heading>
                <Spacer />
                <Text fontSize="2xl">
                  $
                  {hotel &&
                    Math.round(
                      hotel.priceDisplayInfo.displayPrice.amountPerStay
                        .amountUnformatted
                    )}
                </Text>
              </HStack>
              <HStack>
                <Image
                  borderRadius={20}
                  src={
                    IMAGE_CDN +
                    hotel?.basicPropertyData?.photos?.main?.lowResJpegUrl
                      ?.relativeUrl
                  }
                ></Image>
                <Box>
                  <HStack>
                    <Box>
                      <Link
                        fontWeight="bold"
                        fontSize="2xl"
                        href={`https://booking.com/hotel/${hotel?.basicPropertyData?.location?.countryCode}/${hotel?.basicPropertyData?.pageName}.html`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {hotel?.displayName?.text}
                      </Link>
                      <Text>
                        {hotel?.basicPropertyData?.location?.address},{" "}
                        {hotel?.basicPropertyData?.location?.city}
                      </Text>
                    </Box>
                    <Spacer></Spacer>
                  </HStack>
                  <Box
                    p="3"
                    border="1px solid"
                    borderColor="black.100"
                    borderRadius="md"
                  >
                    <Box fontSize="2xl">
                      {hotel?.basicPropertyData?.reviewScore?.score}/10
                    </Box>
                    <Text>
                      {
                        hotel?.basicPropertyData?.reviewScore?.totalScoreTextTag
                          ?.translation
                      }
                    </Text>
                  </Box>
                </Box>
              </HStack>
            </Box>
          </Skeleton>
        )}
        {(loadingAttractions || attractions !== null) && (
          <Skeleton isLoaded={attractions !== null}>
            <HStack>
              <Heading>Selected Itinerary</Heading>
              <Spacer />
              <Text fontSize="2xl">
                $
                {Math.round(
                  Object.values((attractions ?? placeholderAttraction).bookings)
                    .map(
                      (booking) =>
                        booking.representativePrice.publicAmount *
                        (formData.adults + formData.children)
                    )
                    .reduce((a, b) => a + b, 0)
                )}
              </Text>
            </HStack>
            <Box>
              {Object.entries(
                (attractions ?? placeholderAttraction).schedule
              ).map(([date, events], i) => {
                const d = date.split(" (");
                const actualDate = new Date(d[1].slice(0, d[1].length - 1));
                const day = parseInt(d[0]);

                return (
                  <HStack alignItems="stretch" key={i + " attractions"}>
                    <Box position="relative">
                      <Box
                        w={4}
                        h={4}
                        bgColor="gray.400"
                        borderRadius="50%"
                        position="absolute"
                        top="5"
                      />
                      <Box
                        h={"full"}
                        mx={2}
                        borderLeft="1px solid"
                        borderColor="gray.400"
                      ></Box>
                    </Box>
                    <Box key={i}>
                      <Text fontSize="xl" mt="3">
                        Day {day} (
                        {actualDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        )
                      </Text>
                      {events.map((event, j) => {
                        const attra = (attractions ?? placeholderAttraction)
                          .bookings[event.ID];
                        return (
                          <Box my="3" key={j + " info"}>
                            <HStack>
                              <Image
                                src={attra.primaryPhoto.small}
                                borderRadius={6}
                                h={"44"}
                              ></Image>
                              <Box ml="2">
                                <HStack>
                                  <Link
                                    href={`https://booking.com/attractions/${attra.ufiDetails.url.country}/${attra.slug}.html`}
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {attra.name}
                                  </Link>
                                  <Spacer />
                                  <Text fontSize="2xl">
                                    $
                                    {Math.round(
                                      attra.representativePrice.publicAmount *
                                        (formData.adults + formData.children)
                                    )}
                                  </Text>
                                </HStack>
                                <Text>{attra.shortDescription}</Text>
                                <Box
                                  px={4}
                                  py={3}
                                  mt={5}
                                  borderRadius="8"
                                  position="relative"
                                  border="2px solid"
                                  borderColor={"yellow.300"}
                                  boxShadow="0px 4px 21px 0px rgba(255, 241, 116, 0.25)"
                                >
                                  <Text
                                    position="absolute"
                                    bgColor="white"
                                    fontSize="sm"
                                    top="-3"
                                  >
                                    Comments
                                  </Text>
                                  <Text>{event.Justification}</Text>
                                </Box>
                              </Box>
                            </HStack>
                          </Box>
                        );
                      })}
                    </Box>
                  </HStack>
                );
              })}
            </Box>
          </Skeleton>
        )}
        {attractions !== null && (
          <Box mt="2">
            <Heading>Budget Breakdown</Heading>
            <Box></Box>
          </Box>
        )}
      </Box>
    </Flex>
  );
};
export default MultiStepForm;
