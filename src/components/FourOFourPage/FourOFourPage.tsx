import React from 'react';
import styles from './FourOFourPage.module.css';
export default class FourOFourPage extends React.Component {
    public render () {
        return <div className={styles.Container} style={{backgroundImage: 'unset'}}>
            <h2 className={styles.SecondTitle}>
                Looks like we haven't built that!
            </h2>
        </div>
    }
}