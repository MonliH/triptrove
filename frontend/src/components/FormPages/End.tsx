import React from 'react';
import { Heading } from '@chakra-ui/react';

type EndProps = {
    loading:boolean;
};

const End:React.FC<EndProps> = ({loading}) => {
    
    return (
        <>
        {loading && (<Heading textAlign="center" color="blue">Generating Trip Plan</Heading>)}
    
    </>
        )
}
export default End;