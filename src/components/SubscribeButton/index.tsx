import styles from './styles.module.scss'
import {useSession, signIn} from "next-auth/react";
import {api} from "../../services/api";
import {getStripeJs} from "../../services/stripe-js";
import {session} from "next-auth/core/routes";
import {useRouter} from "next/router";

interface SubscribeButtonProps {
    priceId: string
}

export const SubscribeButton = ({priceId}: SubscribeButtonProps) => {
    const {data: Session} = useSession()
    const router = useRouter()
    // console.log("session no button-----------------------------------------------------------------------------", Session)

    const handleSubscribe = async () => {
        if(!Session){
            signIn('github')
            return
        }

        if(Session.activeSubscription) {
            router.push('/posts')
            return
        }

        try {
            const response = await api.post('/subscribe', {priceId})
            console.log("response no button-----------------------------------------------------------------------------", response)
            const { sessionId } = response.data
            console.log("sessionID no button-----------------------------------------------------------------------------", sessionId)

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId: sessionId})

        } catch (e){
            console.log('e do catch-----------------------------------------------------------------------------',e)
        }
    }

    return (
        <button className={styles.subscribeButton} onClick={() => handleSubscribe()}>
            Subscribe Now
        </button>
    );
};