import React from 'react'
import styles from './styles.module.css'

const PlayerTimeline = ({ duration, currentTime, onClick }) => {
  const clickHandler = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width * 100
    const timeToGo = duration / 100 * percentage
    onClick(timeToGo)
  }

  return <div
    className={styles['player-timeline']}
    onClick={clickHandler}
  >
    <div
      className={styles['player-timeline__bar']}
      style={{
        width: `${currentTime / duration * 100}%`
      }}
    />
  </div>
}


export default PlayerTimeline