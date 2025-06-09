import { Dispatch, SetStateAction, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router';

type Props = {
    paymentIntentId?: string;
    setPaymentIntentId?: Dispatch<SetStateAction<string | null>>;
    text?: string;
    returnPath?: string;
}

const Payment = ({ paymentIntentId, setPaymentIntentId, text, returnPath }: Props) => {
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);

    const confirmPayment = async () => {
        const card = elements?.getElement(CardElement);
        if (!stripe || !elements || !card || !paymentIntentId) return;

        setIsProcessing(true);
        const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
            payment_method: { card },
            return_url: `${window.location.origin}${returnPath || "/specter/promotions?tab=All"}`,
        });

        if (error) {
            setIsProcessing(false);
            enqueueSnackbar(error?.message || "Something went wrong", { autoHideDuration: 5000, variant: "error" });
        } else if (paymentIntent.status === 'succeeded') {
            setPaymentIntentId?.(null);
            setIsProcessing(false);
            navigate("/specter/promotions?tab=All");
            enqueueSnackbar("Payment Successful!", { autoHideDuration: 5000, variant: "success" });
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{text || "Complete Your Payment"}</h2>

            <div className="mb-6">
                <div className="border p-3 rounded-md bg-gray-50">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#333',
                                    '::placeholder': {
                                        color: '#aaa',
                                    },
                                },
                                complete: {
                                    color: '#28a745',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <button
                onClick={confirmPayment}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>

            {isProcessing && (
                <div className="mt-4 flex justify-center">
                    <svg
                        className="animate-spin h-6 w-6 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                            d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                        ></path>
                    </svg>
                </div>
            )}
        </div>
    );
};

export default Payment;
