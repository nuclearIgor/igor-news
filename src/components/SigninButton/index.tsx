import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import {signIn, signOut, useSession} from 'next-auth/react'


export const SignInButton = () => {

    const {data: Session} = useSession()

    console.log(Session)

    return Session ? (
        <button className={styles.signInButton} onClick={() => signOut()}>
            <FaGithub color="#04D361"/>
            {Session.user.name}
            <FiX color="#737380" className={styles.closeIcon}/>
        </button>
    ) : (
        <button className={styles.signInButton} onClick={() => signIn('github')}>
            <FaGithub color="#EBA417"/>
            Sign in with Github
        </button>
    )
};