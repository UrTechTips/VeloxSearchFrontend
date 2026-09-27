import Navbar from '@/components/Navbar/Navbar.component';
import LoginContainer from './loginContainer.component';
import { Suspense } from 'react';

export const metadata = {
    title: 'Login',
    description: 'Login page for the application',
}

const Login = async () => {    
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                <LoginContainer />
            </Suspense>
        </>
    )
}

export default Login