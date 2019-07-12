import waves, {getSamples} from './piano'
import Tone from 'tone'


const SAMPLE_PATH = './piano/'


export const loadSampler = () => {
  const samples = getSamples()
  return  new Tone.Sampler(samples,() => console.log('hoho')).toMaster()
}
export const loadSynth = () => {
  return new Tone.PolySynth(6,Tone.MonoSynth).toMaster();
}

export const loadOneSample = (which = 0)=> {
  if (waves) {

   return new Tone.Player(`piano/A0.mp3`).toMaster()
  }
}


export const loadSamples = () => {

  const promises = []
const players = []
  waves.forEach(url => {
    console.log(`sample path: ${SAMPLE_PATH}${url}`)
    const player = new Tone.Player(`${SAMPLE_PATH}${url}`).toMaster()
    players.push(player)
    const promise = new Promise((resolve, reject) => {
      player.buffer.onload = resolve
      player.buffer.onerror = reject
    })
    promises.push(promise)
  })
  Promise.all(promises).then(samples => {
    console.log('got it!', samples)
    const sounds = {}
    for (let i = 0; i < players.length; i++) {
      const marker = waves[i].split('.')[0]
      sounds[marker] = players[i]

    }
    return sounds

  }).catch(error => console.log(`Error loading samples:${error}`))


}

