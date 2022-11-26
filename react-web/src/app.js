import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

// Pages
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignupPage from './pages/SignUpPage';
import SignoutPage from './pages/SignOut';

export default function App() {

    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    
    React.useEffect(() => {
        if (text === 'dark') {
            toggleColorMode()
        }
    });

    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signout" element={<SignoutPage />} />

            </Routes>
        </BrowserRouter>
    );
};
