from fastapi import FastAPI
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

        return res.json()
