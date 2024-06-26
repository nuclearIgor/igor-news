import styles from './styles.module.scss'
import {SignInButton} from "../SigninButton";
import {ActiveLink} from "./ActiveLink";

export const Header = () => {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="news-logo"/>
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/" >
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SignInButton/>
            </div>
        </header>
    );
};