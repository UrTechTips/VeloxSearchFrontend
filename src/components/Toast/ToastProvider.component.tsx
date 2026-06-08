'use client';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.overrides.scss';

const ToastProvider = () => (
    <ToastContainer
        position="top-center"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        transition={Slide}
        theme="dark"
    />
);

export default ToastProvider;