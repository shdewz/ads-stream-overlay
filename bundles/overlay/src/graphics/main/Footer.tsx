import { TeamScores } from './TeamScores';
import { MapInfo } from './MapInfo';
import styles from './styles/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <TeamScores />
      <MapInfo />
    </footer>
  );
};
