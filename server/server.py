from fastapi import FastAPI
from pydantic import BaseModel
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BOOKING_URL = "https://www.booking.com/dml/graphql"


@app.get("/")
async def root():
    return {"message": "Hello World"}


def json_to_text(data):
    options = []  # Charge amount is in USD, maybe use a converter API

    for item in data:
        string = ""
        string += f"Location: {item['ufiDetails']['bCityName']}, {item['ufiDetails']['countryName']} \n"
        string += f"Name: {item['name']} \n"
        string += f"Price: {item['representativePrice']['chargeAmount']} \n"
        string += f"Description: {item['description']} \n"
        options.append(string)
    return options


@app.get("/results")
async def locations(ufi: int):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            BOOKING_URL,
            json=
            {
                "operationName": "SearchProducts",
                "variables": {
                    "input": {
                        "filterByEndDate": "2023-06-30",
                        "filterByStartDate": "2023-06-23",
                        "ufi": ufi,
                        "extractFilterStats": True,
                        "extractFilterOptions": True,
                        "extractSorters": True,
                        "extractSections": False,
                        "limit": 5,
                        "source": "search_results",
                        "page": 1
                    },
                    "contextParams": {
                        "urlCode": "",
                        "test": False,
                        "showInactive": False,
                        "source": "",
                        "adPlat": "",
                        "label": ""
                    },
                    "fullProductInfo": True
                },
                "extensions": {},
                "query": "query SearchProducts($input: AttractionsProductSearchInput!, $contextParams: AttractionsContextParamsInput, $fullProductInfo: Boolean!) {\n  attractionsProduct {\n    searchProducts(input: $input, contextParams: $contextParams) {\n      ... on AttractionsProductSearchResponse {\n        filterOptions {\n          destinationFilters {\n            ...FilterOptionFragment\n            __typename\n          }\n          labelFilters {\n            ...FilterOptionFragment\n            __typename\n          }\n          priceFilters {\n            ...FilterOptionFragment\n            __typename\n          }\n          typeFilters {\n            ...FilterOptionFragment\n            __typename\n          }\n          ufiFilters {\n            ...FilterOptionFragment\n            __typename\n          }\n          __typename\n        }\n        filterStats {\n          filteredProductCount\n          unfilteredProductCount\n          __typename\n        }\n        unavailableProducts\n        products {\n          ...AttractionsProductFragment @include(if: $fullProductInfo)\n          ...AttractionsProductCardFragment @skip(if: $fullProductInfo)\n          __typename\n        }\n        sections {\n          attr_book_score {\n            ...AttractionsProductFragment @include(if: $fullProductInfo)\n            ...AttractionsProductCardFragment @skip(if: $fullProductInfo)\n            __typename\n          }\n          distance_to_hotel {\n            ...AttractionsProductFragment @include(if: $fullProductInfo)\n            ...AttractionsProductCardFragment @skip(if: $fullProductInfo)\n            __typename\n          }\n          trending {\n            ...AttractionsProductFragment @include(if: $fullProductInfo)\n            ...AttractionsProductCardFragment @skip(if: $fullProductInfo)\n            __typename\n          }\n          __typename\n        }\n        autoExtendBanner {\n          hasNearbyProducts\n          hasOwnProducts\n          nearbyProductFirstIndex\n          __typename\n        }\n        sorters {\n          name\n          value\n          __typename\n        }\n        defaultSorter {\n          name\n          value\n          __typename\n        }\n        noResultsForQuery\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment FilterOptionFragment on FilterOption {\n  image {\n    url\n    __typename\n  }\n  name\n  productCount\n  tagname\n  childFilterOptions {\n    name\n    tagname\n    productCount\n    __typename\n  }\n  __typename\n}\n\nfragment AttractionsProductFragment on AttractionsProduct {\n  accessibility\n  additionalInfo\n  additionalBookingInfo {\n    childRatesApplicability {\n      label\n      __typename\n    }\n    freeForChildren {\n      age {\n        label\n        __typename\n      }\n      __typename\n    }\n    onlyRegularTickets {\n      label\n      __typename\n    }\n    participantsPerBooking {\n      label\n      __typename\n    }\n    __typename\n  }\n  addresses {\n    arrival {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    attraction {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    departure {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    entrance {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    guestPickup {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    meeting {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    pickup {\n      ...AttractionsAddressFragment\n      __typename\n    }\n    __typename\n  }\n  applicableTerms {\n    policyProvider\n    __typename\n  }\n  audioSupportedLanguages\n  cancellationPolicy {\n    comparedTo\n    hasFreeCancellation\n    isStillRefundable\n    percentage\n    period\n    until\n    __typename\n  }\n  covid\n  dietOptions\n  description\n  guideSupportedLanguages\n  healthSafety\n  id\n  isBookable\n  labels {\n    text\n    type\n    __typename\n  }\n  name\n  notIncluded\n  offers {\n    additionalInfo\n    availabilityType\n    benefits {\n      freeAudioGuide {\n        label\n        value\n        __typename\n      }\n      freeDrink {\n        label\n        value\n        __typename\n      }\n      freeTransportation {\n        label\n        value\n        __typename\n      }\n      inStoreDiscount {\n        label\n        value\n        __typename\n      }\n      priorityLane {\n        label\n        value\n        __typename\n      }\n      skipTheLine {\n        label\n        value\n        __typename\n      }\n      __typename\n    }\n    description\n    id\n    items {\n      constraint {\n        label\n        maxAge\n        maxGroupSize\n        minAge\n        minGroupSize\n        numAdults\n        numChildren\n        numPeople\n        type\n        __typename\n      }\n      duration {\n        label\n        value\n        __typename\n      }\n      id\n      label\n      maxPerReservation\n      minPerReservation\n      tieredPricing\n      travelerCountRequired\n      type\n      __typename\n    }\n    label\n    languageOptions {\n      label\n      language\n      type\n      __typename\n    }\n    locationInstructions\n    notIncluded\n    reservationRestrictions {\n      adultRequiredForReservation\n      maxOfferItemsPerReservation\n      minOfferItemsPerReservation\n      __typename\n    }\n    typicalDuration {\n      label\n      value\n      __typename\n    }\n    typicalFrequency {\n      label\n      value\n      __typename\n    }\n    whatsIncluded\n    __typename\n  }\n  onSiteRequirements {\n    adultSupervisionRequired {\n      label\n      maxAge\n      __typename\n    }\n    age {\n      label\n      min\n      max\n      __typename\n    }\n    clothingCoveringShouldersKneesRequired {\n      label\n      __typename\n    }\n    comfortableFootwearRecommended {\n      label\n      __typename\n    }\n    drivingLicenseRequired {\n      label\n      __typename\n    }\n    earlyArrival {\n      label\n      minutes\n      __typename\n    }\n    height {\n      label\n      min\n      max\n      __typename\n    }\n    noAlcoholDuringDryDays {\n      label\n      __typename\n    }\n    noAlcoholDuringRamadan {\n      label\n      __typename\n    }\n    onlyOperatesInGoodWeather {\n      label\n      __typename\n    }\n    proofOfIdentityRequired {\n      label\n      __typename\n    }\n    ticketCollection {\n      label\n      __typename\n    }\n    unsuitable {\n      label\n      pregnant\n      reducedMobility\n      __typename\n    }\n    voucherPrintingRequired {\n      label\n      value\n      __typename\n    }\n    weight {\n      label\n      min\n      max\n      __typename\n    }\n    writtenConsentForChildren {\n      label\n      maxAge\n      __typename\n    }\n    __typename\n  }\n  operatedBy\n  photos {\n    ...PhotoTypesFragment\n    __typename\n  }\n  pickupTypes {\n    type\n    __typename\n  }\n  postBookingInfo\n  poweredBy\n  primaryLabel {\n    text\n    type\n    __typename\n  }\n  primaryPhoto {\n    ...PhotoTypesFragment\n    __typename\n  }\n  representativePrice {\n    chargeAmount\n    currency\n    publicAmount\n    __typename\n  }\n  restrictions\n  reviewsStats {\n    allReviewsCount\n    isGoodScore\n    percentage\n    numericStats {\n      average\n      total\n      __typename\n    }\n    providerNumericStats {\n      average\n      total\n      providerName\n      __typename\n    }\n    __typename\n  }\n  shortDescription\n  supplierInfo {\n    isIndividual\n    details {\n      address\n      name\n      __typename\n    }\n    __typename\n  }\n  supportedFeatures {\n    alternativeTimeSlotsPartiallySupported\n    alternativeTimeSlotsSupported\n    liveAvailabilityCheckPartiallySupported\n    liveAvailabilityCheckSupported\n    isDisneyProduct\n    __typename\n  }\n  slug\n  taxonomy {\n    categories {\n      label\n      slug\n      __typename\n    }\n    tags {\n      label\n      slug\n      __typename\n    }\n    type {\n      label\n      slug\n      __typename\n    }\n    __typename\n  }\n  timeZone\n  typicalDuration {\n    label\n    value\n    __typename\n  }\n  typicalFrequency {\n    label\n    value\n    __typename\n  }\n  ufi\n  ufiDetails {\n    ...UfiDetailsFragment\n    __typename\n  }\n  contextUfiDetails {\n    ...UfiDetailsFragment\n    __typename\n  }\n  uniqueSellingPoints\n  whatsIncluded\n  flags {\n    flag\n    value\n    rank\n    __typename\n  }\n  itinerary {\n    type\n    __typename\n  }\n  __typename\n}\n\nfragment AttractionsAddressFragment on AttractionsAddress {\n  address\n  city\n  country\n  googlePlaceId\n  id\n  instructions\n  latitude\n  locationType\n  longitude\n  publicTransport\n  zip\n  __typename\n}\n\nfragment PhotoTypesFragment on AttractionsPhoto {\n  hereProductPageDesktop\n  hereProductPageMobile\n  gallery\n  small\n  __typename\n}\n\nfragment UfiDetailsFragment on AttractionLocationResponse {\n  attractionsCount\n  bCityName\n  bInCityName\n  banners {\n    content\n    title\n    type\n    __typename\n  }\n  image\n  latitude\n  longitude\n  ufi\n  url {\n    city\n    country\n    prefix\n    __typename\n  }\n  countryName\n  __typename\n}\n\nfragment AttractionsProductCardFragment on AttractionsProduct {\n  id\n  slug\n  name\n  primaryPhoto {\n    small\n    __typename\n  }\n  cancellationPolicy {\n    hasFreeCancellation\n    __typename\n  }\n  shortDescription\n  ufiDetails {\n    bCityName\n    bInCityName\n    ufi\n    __typename\n  }\n  flags {\n    flag\n    value\n    rank\n    __typename\n  }\n  representativePrice {\n    chargeAmount\n    currency\n    publicAmount\n    __typename\n  }\n  reviewsStats {\n    allReviewsCount\n    isGoodScore\n    percentage\n    numericStats {\n      average\n      total\n      __typename\n    }\n    providerNumericStats {\n      average\n      total\n      providerName\n      __typename\n    }\n    __typename\n  }\n  typicalDuration {\n    label\n    __typename\n  }\n  primaryLabel {\n    text\n    type\n    __typename\n  }\n  __typename\n}\n"
            }
        )

        data = res.json()
        products = data["data"]["attractionsProduct"]["searchProducts"]["products"]

        information = []
        not_want = ["uniqueSellingPoints", "labels", "itinerary", "poweredBy", "__typename", "accessibility",
                    "supplierInfo", "postBookingInfo", "primaryLabel", "operatedBy", "flags", "slug", "applicableTerms",
                    "onSiteRequirements", "covid", "guideSupportedLanguages", "audioSupportedLanguages", "healthSafety",
                    "contextUfiDetails", "isBookable", "additionalBookingInfo", "typicalFrequency", "supportedFeatures",
                    "offers"]

        for i, product in enumerate(products):
            information.append({})
            for key, value in product.items():
                if key not in not_want:
                    information[i][key] = value

        return json_to_text(information)


@app.get("/destinations")
async def destinations(query: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            BOOKING_URL,
            json={
                "operationName": "SearchAutoComplete",
                "variables": {
                    "input": {"limit": 4, "query": query},
                    "contextParams": {
                        "urlCode": "",
                        "test": False,
                        "showInactive": False,
                        "source": "",
                        "adPlat": "",
                        "label": "gen173nr-1FCAEoggI46AdIM1gEaCeIAQGYATG4AQfIAQzYAQHoAQH4AQKIAgGoAgO4ApSq2KQGwAIB0gIkMjAwNjEwZjMtZjViMS00N2M3LWE1MTEtNzVmYzYwOWMyYTFl2AIF4AIB",
                    },
                },
                "extensions": {},
                "query": "query SearchAutoComplete($input: AttractionsSearchAutoCompleteInput!, $contextParams: AttractionsContextParamsInput) {\n  attractionsProduct {\n    searchAutoComplete(input: $input, contextParams: $contextParams) {\n      __typename\n      ... on AttractionsSearchAutoCompleteResponse {\n        products {\n          ...AttractionsSearchProductSuggestionFragment\n          __typename\n        }\n        destinations {\n          ...AttractionsSearchDestinationSuggestionFragment\n          __typename\n        }\n        __typename\n      }\n      ... on AttractionsOrchestratorErrorResponse {\n        error\n        message\n        statusCode\n        __typename\n      }\n    }\n    __typename\n  }\n}\n\nfragment AttractionsSearchProductSuggestionFragment on AttractionsSearchProductSuggestion {\n  title\n  productId\n  productSlug\n  taxonomySlug\n  imageUrl\n  cityUfi\n  cityName\n  cityUrlName\n  countryCode\n  tracking {\n    prid\n    prPageViewId\n    __typename\n  }\n  __typename\n}\n\nfragment AttractionsSearchDestinationSuggestionFragment on AttractionsSearchDestinationSuggestion {\n  region\n  ufi\n  cc1\n  cityUrl\n  srUrl\n  productCount\n  destType\n  country\n  cityName\n  imageUrl\n  __typename\n}\n",
            },
        )

        return res.json()["data"]["attractionsProduct"]["searchAutoComplete"]["destinations"]


@app.get("/flightDestinations")
async def flightDestinations(query: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://flights.booking.com/api/autocomplete/en?q={query}&accessToken=",
        )

        return res.json()


class Location(BaseModel):
    code: str
    city: str
    cityName: str
    country: str


class GetFlights(BaseModel):
    adults: int
    children: int
    departDate: str
    returnDate: str
    fromLocation: Location
    toLocation: Location


@app.post("/flightsToDestination")
async def flightsToDestination(body: GetFlights):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://flights.booking.com/api/flights/",
            params={
                "type": "ROUNDTRIP",
                "adults": body.adults,
                "cabinClass": "ECONOMY",
                "children": body.children,
                "from": body.fromLocation.city + ".CITY",
                "to": body.toLocation.city + ".CITY",
                "fromCountry": body.fromLocation.country,
                "toCountry": body.toLocation.country,
                "fromLocationName": body.fromLocation.cityName,
                "toLocationName": body.toLocation.cityName,
                "depart": body.departDate,
                "return": body.returnDate,
                "sort": "CHEAPEST",
                "travelPurpose": "leisure",
                "aid": 304142,
                "label": "gen173nr-1FEghwYWNrYWdlcyiCAjjoB0gzWARoJ4gBAZgBMbgBB8gBDNgBAegBAfgBAogCAagCA7gCvrPYpAbAAgHSAiQ5ZDQ1MDI0Ny1jMzEyLTQ3YzUtYWI5My0zN2EyYTcwNjk3ZjHYAgXgAgE",
                "enableVI": 1
            },
            headers={
                "Accept": "*/*",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0",
                "Accept-Language": "en-US,en;q=0.5",
                "X-Requested-From": "clientFetch",
                "X-Flights-Context-Name": "search_results",
                "X-Booking-Affiliate-Id": "304142",
                "X-Booking-Label": "gen173nr-1FEghwYWNrYWdlcyiCAjjoB0gzWARoJ4gBAZgBMbgBB8gBDNgBAegBAfgBAogCAagCA7gCvrPYpAbAAgHSAiQ5ZDQ1MDI0Ny1jMzEyLTQ3YzUtYWI5My0zN2EyYTcwNjk3ZjHYAgXgAgE"
            },
            timeout=None
        )

        offers = res.json()["flightOffers"]
        oneToUse = offers[0]
        price = sum([item["travellerPriceBreakdown"]["total"]["units"] for item in oneToUse["travellerPrices"]])

        return {"details": offers[0]["segments"], "price": price}
