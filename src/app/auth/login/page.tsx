import Navbar from '@/components/Navbar/Navbar.component';
import LoginContainer from './loginContainer.component';

const Login = async () => {    
    return (
        <>
            <Navbar loggedIn={false} />
            <LoginContainer />
        </>
    )
}

export default Login