import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import {query as q} from 'faunadb'
import {fauna} from '../../../services/fauna'

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            // scope: 'read:user'
        }),
    ],
    jwt: {
        signingKey: process.env.SIGNING_KEY
    },
    callbacks: {
        async session(session){
            // console.log('next auth _________________________________________________________________________________', session.token.email)

            try {
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection(
                            q.Match(
                                q.Index('subscription_by_user_ref'),
                                q.Select(
                                    "ref",
                                    q.Get(
                                        q.Match(
                                            q.Index('user_by_email'),
                                            q.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            q.Match(
                                q.Index('subscription_by_status'),
                                "active"
                            )
                        )
                    )
                )
                    return {
                        ...session,
                        activeSubscription: userActiveSubscription
                    }
                } catch  {
                    return {
                        ...session,
                        activeSubscription: null
                    }
                }


        },
        async signIn(user, account, profile){
            const {email} = user.user

            try {
                await fauna.query(
                   q.If(
                       q.Not(
                           q.Exists(
                               q.Match(
                                   q.Index('user_by_email'),
                                   q.Casefold(email)
                               )
                           )
                       ),
                       q.Create(
                           q.Collection('users'),
                           {data: {email} }
                       ),
                   //    q.upate
                       q.Get(
                           q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email)
                           )
                       )
                   )
                )
                return true
            } catch {
                return false
            }
        },
    }
}

export default NextAuth(authOptions)