import styles from './styles/Chat.module.css';
import { useTosu } from '@/hooks/useTosu';

const MAX_VISIBLE = 6;

export const Chat = () => {
  const { data } = useTosu();
  const scoreVisible = data?.tourney?.scoreVisible ?? false;
  const liveMessages = data?.tourney?.chat ?? [];
  const messages = liveMessages.slice(-MAX_VISIBLE);

  return (
    <div className={`${styles.chat} ${scoreVisible ? styles.hidden : ''}`}>
      {messages.map((msg, i) => (
        <div key={i} className={styles.message}>
          <span
            className={`${styles.name} ${
              msg.team === 'left' ? styles.nameRed : msg.team === 'right' ? styles.nameBlue : ''
            }`}
          >
            {msg.name}
          </span>
          <span className={styles.text}>{msg.message}</span>
        </div>
      ))}
    </div>
  );
};
