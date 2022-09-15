import styles from './styles.module.scss'
import {SignInButton} from "../SigninButton";

export const Header = () => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="news-logo"/>
                <nav>
                    <a className={styles.active}>Home</a>
                    <a>Posts</a>
                </nav>

                <SignInButton/>
            </div>
        </header>
    );
};