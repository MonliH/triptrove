from fastapi import FastAPI
from pydantic import BaseModel
import httpx

app = FastAPI()

BOOKING_URL = "https://www.booking.com/dml/graphql"


@app.get("/")
async def root():
    return {"message": "Hello World"}


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
