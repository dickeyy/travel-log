import { Box, Button, ChakraProvider, Checkbox, Divider, FormControl, FormErrorMessage, FormLabel, Heading, Highlight, HStack, Image, Input, InputGroup, InputRightElement, Link, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import theme from "../theme";
import { Formik, Form, Field } from 'formik';
import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { NavLink } from "react-router-dom";

function SignInPage() {

    const cookies = new Cookies();

    const [password, setPassword] = React.useState("");
    const [session, setSession] = React.useState(cookies.get('travel-session'));
    const toast = useToast()

    React.useEffect(() => {
        console.log(session);
        if (session !== undefined) {
            window.location.href = '/';
        }
    }, [session]);

    const validateEmail = (values) => {
        let errors
        if (!values) {
            errors = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values)) {
            errors = 'Invalid email address';
        }

        return errors
    }

    function validatePassword(value) {
        let error
        if (!value) {
            error = 'Password is required'
        } else if (value.length < 8) {
            error = 'Password must be at least 8 characters'
        } else if (value.length > 50) {
            error = 'Password must be less than 50 characters'
        }
        setPassword(value)
        return error
    }

  return (
    <ChakraProvider theme={theme}>
      <Box >
        <Box
            h={'100vh'}
            w={'100%'}
            p={10}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDir={'column'}
        >
            <Heading>
                Sign In
            </Heading>

            <Box
                p={10}
                bgColor={'whiteAlpha.300'}
                borderRadius={'20'}
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}
                display={'flex'}
                flexDir={'column'}
                mt={10}
            >

                <Stack spacing={5} w={'fit-content'}>

                    <FormControl isRequired>
                        <Formik
                            initialValues={{ email: null, password: null, }}
                            onSubmit={(values, actions) => {
                                setTimeout(() => {
                            
                                    axios.post('https://4e3xnppei9.execute-api.us-east-1.amazonaws.com/auth/signin', {
                                            email: values.email,
                                            password: values.password
                                        }).then(res => {
                                        let data = res.data
                                        if (data.message === "User found") {

                                            cookies.set('travel-session', `${data.user.uid}`, { path: '/' })

                                            toast({
                                                title: "Logged in.",
                                                description: "You have been logged in.",
                                                status: "success",
                                                duration: 5000,
                                                isClosable: true,
                                            })

                                            window.location.href = '/';
                                        } else {
                                            toast({
                                                title: "Error",
                                                description: data.error,
                                                status: "error",
                                                duration: 5000,
                                                isClosable: true,
                                            })
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                        toast({
                                            title: "Error",
                                            description: "An error occurred while logging in.",
                                            status: "error",
                                            duration: 5000,
                                            isClosable: true,
                                        })
                                    })

                                    actions.setSubmitting(false)
                                }, 1000)
                            }}
                        >

                        {(props) => (
                            <Form>
                                <Field name='email' validate={validateEmail}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.email && form.touched.email}>
                                        <FormLabel>Email</FormLabel>
                                        <Input {...field} placeholder='name@domain.com' type={'email'} />
                                        <FormErrorMessage mb={5}>{form.errors.email}</FormErrorMessage>
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field name='password' validate={validatePassword}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.password && form.touched.password}>
                                        <FormLabel>Password</FormLabel>
                                        <Input {...field} placeholder='greatPassword'type={'password'}  />
                                        <FormErrorMessage mb={5}>{form.errors.password}</FormErrorMessage>
                                        <Box h={2}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                
                                <Button
                                    mt={4}
                                    colorScheme='red'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                >
                                    Submit
                                </Button>
                            </Form>
                        )}
                        </Formik>
                    </FormControl>
                    <NavLink to={'/signup'}>
                        <Link _hover={{ color: 'red.500', textDecoration: 'underline' }}>
                            Don't have an account?
                        </Link>
                    </NavLink>
                </Stack>

            </Box>

        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default SignInPage;
