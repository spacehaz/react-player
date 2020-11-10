import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
import playlist from './playlist'
import PlaylistItem from './playlist-item'
import PlayerTimeline from './player-timeline'
import throttling from '../utils/throttling'
import convertToColor from '../utils/convert-to-color'
import ctm from '../utils/convert-to-minutes'
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const Player = () => {
  const [ currentTrack, setCurrentTrack ] = useState(playlist[0])
  const [ currentTime, setCurrentTime ] = useState(0)
  const [ audioCtx, setAudioCtx ] = useState(null)
  // запустили плеер -> каждую секунду обновляем currentTime
  const [ duration, setDuration ] = useState(0)
  // запустили плеер -> единожды обновляем duration

  const [ isPlaying, setIsPlaying ] = useState(false)
  // запустили плеер -> isPlaying делаем true
  // остановили плеер -> isPlaying делаем false

  const myPlayer = useRef(null)
  const myEqualizer = useRef(null)


  const onTimeUpdate = throttling(e => {
    setCurrentTime(e.target.currentTime)
  }, 1000)

  const onPlay = e => {
    setDuration(e.target.duration)
  }

  useEffect(_ => {
    const ctx = new AudioContext();
    const audio = myPlayer.current
    const audioSrc = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    
    audioSrc
      .connect(analyser)
      .connect(ctx.destination)
    analyser.connect(ctx.destination)

    setAudioCtx(ctx)

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const equalizer = _ => {
      requestAnimationFrame(equalizer)
      analyser.getByteFrequencyData(dataArray);
      const data = dataArray.toString()
      myEqualizer.current.style.backgroundColor = convertToColor(dataArray.toString(data))
      myEqualizer.current.innerText = data
    }

    equalizer()

    
    // // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
   
    // // frequencyBinCount tells you how many values you'll receive from the analyser
    
    // // // we're ready to receive some data!
    // // // loop
    
  }, [])

  return <div
    className={styles['player']}
  >
    <div className={styles['player__equalizer']} ref={myEqualizer} />
    <div className={styles['player__controls']}>
      <PlayerTimeline
        currentTime={currentTime}
        duration={duration}
        onClick={time => {
          myPlayer.current.currentTime = time
        }}
      />
      <div>{currentTrack.title}</div>
      <div>playing time: {ctm(currentTime)}</div>
      <div>duration: {ctm(duration)}</div>
      <button
        onClick={_ => {
          if (isPlaying) {
            myPlayer.current.pause()
            setIsPlaying(false)
          } else {
            
            if (audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
            myPlayer.current.play()
            setIsPlaying(true)
          }
        }}
      >
        {isPlaying ? 'pause' : 'play'}
      </button>
      <audio
        src={currentTrack.audioFile}
        className={styles['player__audio']}
        ref={myPlayer}
        onPlay={onPlay}
        onPause={_ => console.log('pause')}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={_ => 
          setDuration(myPlayer.current.duration)
        }
      />
    </div>


    <div className={styles['player__playlist']}>
      {playlist.map(item => <PlaylistItem
        item={item}
        key={item.id}
        onClick={item => {
          setCurrentTrack(item)
          setIsPlaying(false)
        }}
      />)}
    </div>
  </div>
}


export default Player