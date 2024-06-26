import {GetStaticProps} from 'next'

import Head from "next/head";

import styles from './home.module.scss'
import {SubscribeButton} from "../components/SubscribeButton";
import {stripe} from "../services/stripe";

interface HomeProps {
    product: {
        priceId: string;
        amount: number
    }
}

export default function Home({product}: HomeProps) {
  return (
    <>
        <Head>
            <title>Home | Igor News</title>
        </Head>

        <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <span>emj Hey, welcome</span>
                <h1>News about the <span>React</span> world.</h1>
                <p>Get access to all the publications <br/>
                    {/*<span>for $9.90 a month</span>*/}
                    <span>for {product.amount} month</span>
                </p>

                <SubscribeButton priceId={product.priceId}/>

            </section>

            <img src="/images/avatar.svg" alt="woman coding"/>
        </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
    const price = await stripe.prices.retrieve('price_1LiSIUISM952HwyeRxauLGL1',
        // {expand: ['product']}
    )

    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price.unit_amount / 100),
    }

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}