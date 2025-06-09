import Lottie from 'lottie-react';
import data from '@/assets/animation/complete.json';
import { useNavigate } from 'react-router';
import Home from '../../Home';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className='relative h-screen flex items-center justify-center w-full'>
            <div className='w-[350px] border-[1px] border-gray-200 rounded-xl'>
                <Lottie
                    animationData={data}
                    loop
                    width={300}
                />
                <p className='text-green-700 w-full font-bold text-[24px my-4 text-center'>Payment Successfull</p>
                <button onClick={() => navigate("/specter/home")} className='border border-green-700 rounded-xl flex items-center justify-center gap-2 mx-auto text-[14px] p-2 text-green-700 font-bold my-2' ><Home /> Go Home</button>
            </div>
        </div>
    )
}

export default PaymentSuccess;
