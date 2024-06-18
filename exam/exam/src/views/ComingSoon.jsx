import React, { useState } from 'react';
import styles from './ComingSoon.module.css';

function ComingSoon() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        // Save email to local storage
        localStorage.setItem('submittedEmail', email);
        setSubmitted(true);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Coming Soon!</h1>
            <p className={styles.text}>We are working hard to bring you a new Tool. Stay tuned!</p>

            {submitted ? (
                <p className={styles.thankYouText}>Thanks for supporting and keeping in touch!</p>
            ) : (
                <form
                    action="https://www.w3schools.com/action_page.php"method="post" //onSubmit={handleSubmit}
                    className={styles.form}
                >
                    <input
                        type="email"
                        className={styles.input}
                        placeholder="Enter your email address"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <button type="submit" className={styles.button}>Notify Me!</button>
                </form>
            )}
        </div>
    );
}

export default ComingSoon;
