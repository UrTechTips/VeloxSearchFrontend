import Navbar from '@/components/Navbar/Navbar.component';
import RegisterContainer from './registerContainer.component';
import { Suspense } from 'react';

export const metadata = {
    title: 'Register',
    description: 'Register page for the application',
}

const Register = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                <RegisterContainer />
            </Suspense>
        </>
    )
}

export default Register