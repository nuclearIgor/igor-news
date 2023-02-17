import styles from './styles.module.scss'
import Head from "next/head";
import {GetStaticProps} from "next";
import {getPrismicClient} from "../../services/prismic";
import * as Prismic from "@prismicio/client";
import * as prismicH from '@prismicio/helpers'
import Link from "next/link";

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updated_at: string;
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({posts}: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | Igor news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updated_at}</time>
                                <strong>{post.title}</strong>
                                <p>
                                    {post.excerpt}
                                </p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismicClient = getPrismicClient()

    const response = await prismicClient.getAllByType(
        'post', {
            fetch: ['post.title', 'post.content'],
            pageSize: 100
        })

    const posts = response.map(post => {
        return {
            slug: post.uid,
            title: prismicH.asText(post.data.title),
            excerpt: post.data.content.find(p => p.type === 'paragraph')?.text ?? '',
            updated_at: new Date(post.last_publication_date).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: {
            posts,
        }
    }
}