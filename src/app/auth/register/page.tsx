"use client";
import Navbar from '@/components/Navbar/Navbar.component';
import RegisterContainer from './registerContainer.component';

const Register = () => {
    return (
        <>
            <Navbar loggedIn={false} />
            <RegisterContainer />
        </>
    )
}

export default Register