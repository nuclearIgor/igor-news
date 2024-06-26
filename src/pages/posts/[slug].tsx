import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {getPrismicClient} from "../../services/prismic";
import * as prismicH from "@prismicio/helpers";
import Head from "next/head";

import styles from './post.module.scss'

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updated_at: string;
    }
}

export default function Post({post}: PostProps) {

    return (
        <>
            <Head>
              <title>{post.title} | Igor news</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updated_at}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}}/>
                </article>
            </main>
        </>

    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {

    const session = await getSession({req})

    // console.log('session', session)
    const {slug} = params

    // if(!Session?.activeSubscription) {
    //     return {
    //         redirect: {
    //             destination: '/',
    //             permanent: false
    //         }
    //     }
    // }

    const prismic = getPrismicClient()

    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        slug,
        title: prismicH.asText(response.data.title),
        content: prismicH.asHTML(response.data.content),
        updated_at: new Date(response.last_publication_date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post,
        }
    }
}