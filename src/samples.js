import waves, {getSamples} from './piano'
import Tone from 'tone'


const SAMPLE_PATH = './piano/'


export const loadSampler = () => {
  const samples = getSamples()
  const chorus = new Tone.Chorus(4, 2.5, 0.5);
  const pingPong = new Tone.PingPongDelay(500, 0.32).toMaster();
  const vibrato = new Tone.Vibrato()
  return new Tone.Sampler(samples).connect(pingPong).toMaster()
}
export const loadSynth = () => {
  const chorus = new Tone.Chorus(4, 2.5, 0.5);
  const pingPong = new Tone.PingPongDelay(500, 0.32).toMaster();
const vibrato = new Tone.Vibrato()
  const synth = new Tone.PolySynth(6, Tone.MonoSynth).connect(vibrato).connect(pingPong)
  synth.set({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 1,
      decay: 1,
      sustain: 0.9,
      release: 1
    },
    filter  : {
      Q  : 3 ,
      type  : "lowpass" ,
      rolloff  : -24
    }  ,
    filterEnvelope: {
      attack: 0.06,
      decay: 0.2,
      sustain: 0.5,
      release: 1,
      baseFrequency: 200,
      octaves: 5,
      exponent: 1.2
    }
  })
  return synth;
}

export const loadOneSample = (which = 0) => {
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

