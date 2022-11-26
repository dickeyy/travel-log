import { ChakraProvider } from '@chakra-ui/react';
import theme from "../theme";
import Cookies from 'universal-cookie';
import React from 'react';

function SignoutPage() {
    // Remove the session cookie
    

    React.useEffect(() => {
        const cookies = new Cookies();
        cookies.remove('travel-session');
        window.location.href = '/signin';
    });

    return(
        <ChakraProvider theme={theme}>
        </ChakraProvider>
    )
}

export default SignoutPage;