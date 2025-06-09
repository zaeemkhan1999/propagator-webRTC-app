import { useGetSubscriptionPlans } from '@/app/scene/Subscriptions/query/getSubscriptions';
import PlanCard from './components/Plans';
import { useEffect, useRef, useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { enqueueSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
import { useGetStripeSession } from './query/getCheckoutSession';
import { useNavigate } from 'react-router';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';
import ArrowLeft from '@/assets/icons/ArrowLeft';

const Subscription = () => {
    const user = useSnapshot(userStore.store).user;

    const navigate = useNavigate()
    const stripePromise = useRef<Promise<Stripe | null> | null>(null);
    const [priceId, setPriceId] = useState<string>('');

    const { data, isLoading, refetch, } = useGetSubscriptionPlans();

    useEffect(() => {
        refetch();
        if (!stripePromise.current) {
            stripePromise.current = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        }

        return () => {
            stripePromise.current = null;
        }
    }, []);

    const { isLoading: loadingSession, refetch: getSession } = useGetStripeSession(user?.id?.toString()!, window.location.origin + "/specter/subscription", priceId);

    const handlePayNow = async (id: string) => {
        setPriceId(id);
        const stripe = await stripePromise?.current;

        if (!stripe) {
            stripePromise.current = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
            enqueueSnackbar("Some content couldn't be loaded. Please try again!", { autoHideDuration: 3000, variant: "error" });
            return;
        }

        getSession().then(async ({ data: session }) => {
            if (session?.payment_getStripeSession?.status?.code !== 1) {
                enqueueSnackbar("Something went wrong!, Please try again.", { autoHideDuration: 3000, variant: "error" });
                return;
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId: session.payment_getStripeSession.result,
            });

            if (error) {
                enqueueSnackbar("Something went wrong!, Please try again.", { autoHideDuration: 3000, variant: "error" });
            }
        });
    };

    return (
        isLoading
            ? <div className='h-screen w-full flex items-center justify-center'><CircularProgress /></div>
            : <>
                <div className='flex items-ceter justify-between px-4 my-6'>
                    <ArrowLeft size={20} onClick={() => navigate(`/specter/home`)} />
                    <h2 className='font-bold text-center'>Discover our Subscription Plans</h2>
                    <div></div>
                </div>
                <div className='flex gap-5 flex-wrap justify-center overflow-y-auto h-screen pb-40'>
                    {data?.subscriptionPlan_getSubscriptionPlans.result.items.map(plan => (
                        <PlanCard key={plan.id} item={plan} onClick={handlePayNow} isLoading={loadingSession} />
                    ))}
                </div>
            </>);
};

export default Subscription;
