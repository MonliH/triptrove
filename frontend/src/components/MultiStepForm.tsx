import React, { useState } from "react";
import { Flex, Center, Heading, Text, Input, Button } from "@chakra-ui/react";
import First from "./FormPages/First";
import Second from "./FormPages/Second";
import Third from "./FormPages/Third";

const MultiStepForm: React.FC = () => {
  const [formData, setFormData] = useState<{
    continent: string;
    location: string;
    interests: string;
    adults: number;
    budget: number;
    children: number;
    startDate: string;
    endDate: string;
  }>({
    continent: "",
    location: "",
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
    if(page!=2){
    setPage(page + 1);
    }
    else{
        console.log(formData)
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
