import { Box, Button, ChakraProvider, Checkbox, Divider, FormControl, FormErrorMessage, FormLabel, Heading, Highlight, HStack, Image, Input, InputGroup, InputRightElement, Link, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import theme from "../theme";
import { Formik, Form, Field } from 'formik';
import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { NavLink } from "react-router-dom";

function SignupPage() {

    const cookies = new Cookies();

    const [usernameChecking, setUsernameChecking] = React.useState(false);
    const [usernameAvailable, setUsernameAvailable] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [session, setSession] = React.useState(cookies.get('travel-session'));
    const toast = useToast()

    React.useEffect(() => {
        if (session !== undefined) {
            window.location.href = '/'
        }
    });

    const validateEmail = (values) => {
        let errors
        if (!values) {
            errors = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values)) {
            errors = 'Invalid email address';
        }

        return errors
    }

    function validateFirstName(value) {
        let error
        if (!value) {
          error = 'First Name is required'
        }
        return error
    }

    function validateLastName(value) {
        let error
        if (!value) {
          error = 'Last Name is required'
        }
        return error
    }

    function validateUsername(value) {
        let error
        if (!value) {
          error = 'Username is required'
        } else if (value.length < 3) {
            error = 'Username must be at least 3 characters'
        } else if (value.length > 20) {
            error = 'Username must be less than 20 characters'
        }
        return error
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

    function validateConfirmPassword(value) {
        let error
        if (!value) {
            error = 'Confirm Password is required'
        } else if (value !== password) {
            error = 'Passwords do not match'
        }
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
            bgColor={'rgba(0,0,0,0.5)'}
            bgGradient='linear(to-r, brandBlurple.900, brandPurple.900)'
        >
            <Heading>
                Create Your Account
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
                            initialValues={{ email: null, password: null, confirmPassword: null, termsAccepted: false }}
                            onSubmit={(values, actions) => {
                                setTimeout(() => {
                                    
                                    axios.post('https://4e3xnppei9.execute-api.us-east-1.amazonaws.com/auth/signup', {
                                        email: values.email,
                                        password: values.password,
                                        termsAccepted: values.termsAccepted,
                                    }).then(res => {
                                        let data = res.data
                                        if (data.message === "User created") {
                                            cookies.set('travel-session', `${data.user.uid}`, { path: '/' })

                                            toast({
                                                title: "Account Created",
                                                description: "Your account has been created successfully.",
                                                status: "success",
                                                duration: 5000,
                                                isClosable: true,
                                            })

                                            window.location.href = '/'
                                        } else {
                                            toast({
                                                title: "Error",
                                                description: data.message,
                                                status: "error",
                                                duration: 5000,
                                                isClosable: true,
                                            })
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                        toast({
                                            title: "Error",
                                            description: "An error occurred while creating your account.",
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
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field name='confirmPassword' validate={validateConfirmPassword}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <Input {...field} placeholder='greatPassword' type={'password'} />
                                        <FormErrorMessage mb={5}>{form.errors.confirmPassword}</FormErrorMessage>
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field type="checkbox" name="termsAccepted" >
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.termsAccepted && form.touched.termsAccepted}>
                                        <Checkbox
                                            id="termsAccepted"
                                            name="termsAccepted"
                                            onChange={form.handleChange}
                                            isChecked={form.values.termsAccepted}
                                            colorScheme="teal"
                                        >
                                            I agree to the ToS and Privacy Policy
                                        </Checkbox>
                                        <Box h={2}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                
                                
                                <Button
                                    mt={4}
                                    colorScheme='teal'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                >
                                    Submit
                                </Button>
                            </Form>
                        )}
                        </Formik>
                    </FormControl>
                    <NavLink to={'/signin'}>
                        <Link _hover={{ color: 'blue.500', textDecoration: 'underline' }}>
                            Already have an account?
                        </Link>
                    </NavLink>
                </Stack>

            </Box>

        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default SignupPage;
