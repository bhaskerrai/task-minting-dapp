import styles from "./instructionsComponent.module.css";
import Details from './details/page';

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            NFT<span>Dao</span>
          </h1>
          <h3>Welcome to the DAO!</h3>
        </div>

      </header>
      
      <Details />

      <br />
      <br />
      <br />

      <p className={styles.get_started}>
        An NFT <span>DAO</span>
      </p>
    </div>
  );
}
