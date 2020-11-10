import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import playlist from './playlist'
import throttle from '../utils/throttling'
function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

const Player = () => {
  const [ currentTrack, setCurrentTrack ] = useState(playlist[1])
  const [ currentTime, setCurrentTime ] = useState(0)
  const [ duration, setDuration ] = useState(0)
  const [ isPlaying, setIsPlaying ] = useState(false)
  const player = useRef(null)

  const onPlaying = throttle(function (evt) {
    setCurrentTime(evt.target.currentTime)
  }, 1000)

  const onStart = evt => {
    setDuration(evt.target.duration)
  }


  const updateTrack = item => {
    setCurrentTrack(item)
    setCurrentTime(0)
    player.current.pause()
    setIsPlaying(false)
    setDuration(0)
  }

  return <div className={styles.player}>
    <div className={styles['player__timeline']} onClick={e => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const newTime = duration / 100 * (x / rect.width * 100)
      player.current.currentTime = newTime
    }}>
      <div
        style={{width: `${currentTime === 0 ? 0 : currentTime / duration * 100}%`}}
        className={styles['player__timeline-bar']}

      />
    </div>
    <div className={styles['player__controls']}>
      <div>{currentTrack.title}</div>
      <div>{fmtMSS(Math.round(currentTime))}</div>
      <div>{fmtMSS(Math.round(duration))}</div>
      <button onClick={_ => {
        if (isPlaying) {
          setIsPlaying(false)
          player.current.pause()
        } else {
          setIsPlaying(true)
          player.current.play()
        }
      }}>
        {isPlaying ? 'pause' : 'play'}
      </button>
      <audio
        ref={player}
        src={currentTrack.audioFile}
        controls
        className={styles.player__audio}
        onPlay={onStart}
        onTimeUpdate={onPlaying}
      />
    </div>
    <div className={styles['player__playlist']}>
      {playlist.map(item => <div
        key={item.id}
        onClick={_ => updateTrack(item)}
        className={styles['player__item']}
      >
        {item.title}
      </div>)}
    </div>
  </div>
}

export default Player

