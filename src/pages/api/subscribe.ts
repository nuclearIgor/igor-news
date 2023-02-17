import {NextApiRequest, NextApiResponse} from "next";
import {stripe} from "../../services/stripe";
import {getSession} from "next-auth/react";
import {fauna} from "../../services/fauna";
import {query as q} from 'faunadb'

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.method)
    if(req.method === 'POST') {

        const Session = await getSession({ req })

        console.log('session-------------------------------------------------------------------------------', Session)
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(Session.user.email)
                )
            )
        )
        // console.log('user-------------------------------------------------------------------------------', user)

        let customerId = user.data.stripe_customer_id
        // console.log('customerid-------------------------------------------------------------------------------', customerId)


        if(!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({

            customer: customerId,

            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                {price: 'price_1LiSIUISM952HwyeRxauLGL1', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })
        // console.log('checkoutsession-------------------------------------------------------------------------------', stripeCheckoutSession)

        return res.status(200).json({sessionId: stripeCheckoutSession.id})
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}