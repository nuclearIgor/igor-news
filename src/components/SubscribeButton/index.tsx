import styles from './styles.module.scss'
import {useSession, signIn} from "next-auth/react";
import {api} from "../../services/api";
import {getStripeJs} from "../../services/stripe-js";

interface SubscribeButtonProps {
    priceId: string
}

export const SubscribeButton = ({priceId}: SubscribeButtonProps) => {
    const {data: Session} = useSession()

    const handleSubscribe = async () => {
        if(!Session){
            signIn('github')
            return
        }

        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId: sessionId})

        } catch (e){
            alert(e.message)
        }
    }

    return (
        <button className={styles.subscribeButton} onClick={() => handleSubscribe()}>
            Subscribe Now
        </button>
    );
};