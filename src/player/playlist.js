import sinatra from './audio-files/sinatra.mp3'
import wuTang from './audio-files/wu-tang.mp3'

const playList = [
  {
    title: 'Thats life',
    author: 'Sinatra',
    audioFile: sinatra,
    id: 1
  }, {
    title: 'CREAM',
    author: 'Wu-tang',
    audioFile: wuTang,
    id: 2
  }
]

export default playList