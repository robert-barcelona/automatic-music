import React, {useState, useEffect} from 'react';
import Tone from 'tone'
import UnmuteButton from 'unmute'

import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

import {loadSampler, loadSynth, loadOneSample, loadSamples, getDelay} from "./samples"

import Slider from './Slider'


class Player extends React.Component {


  setOctaves = (octaves) => this.setState({octaves})
  setDurations = (durations) => this.setState({durations})
  setSpaces = (spaces) => this.setState({spaces})
  setNotes = (notes) => this.setState({notes})
  setDelayTime = (delayTime) => this.setState({delayTime})
  setDelayIntensity = (delayIntensity) => this.setState({delayIntensity})


  possibles = ['F', 'G#', 'C', 'C#', 'D#', 'G#', 'F']
  possibles = ['A', 'C#', 'D', 'F', 'A#', 'G', 'E']


  state = {
    player: null,
    octaves: [0, 6],
    durations: [500, 3000],
    spaces: [500, 2000],
    notes: [1, 3],
    delayTime: 2,
    delayIntensity: .25,
    buttonLabel: 'PLAY'
  }

  componentDidUpdate(prevProps, prevState) {
    const {state: {player, delayTime, delayIntensity}} = this
    if (!player) return
    if (delayTime !== prevState.delayTime || delayIntensity !== prevState.delayIntensity) {
      const delay = getDelay(delayTime, delayIntensity).toMaster()
      player.disconnect()

      player.connect(delay)
      console.log('new delay', delay)
    }
  }

  aleatoric = (limit, min = 0) => {
    let val = Math.floor(Math.random() * limit)
    return val >= min ? val : min
  }

  playIt = () => {

    const {possibles, aleatoric, state: {notes, octaves, durations, spaces, player}} = this

    const numberOfNotes = aleatoric(notes[1], notes[0])
    const duration = aleatoric(durations[1], durations[0])
    for (let i = 0; i < numberOfNotes; i++) {
      const note = `${possibles[aleatoric(possibles.length)]}${aleatoric(octaves[1], octaves[0])}`
      if (player) player.triggerAttackRelease(note, duration)
    }
    const time = aleatoric(spaces[1], spaces[0])
    setTimeout(this.playIt, time)

  }

  buttonClick = (e) => {
    let action = e.target.textContent || e.target.innerText;
    action = action.toUpperCase()
    if (action === 'PLAY') this.startPlay()
    else this.stopPlay()
  }

  stopPlay = () => {
    const {state: { player}} = this

    if (player) {
      player.disconnect()
      this.setState({buttonLabel:'PLAY'})

    }
  }


  startPlay = async () => {
    try {
      const {state: { delayTime, delayIntensity}} = this
      let player
      if (!player)  player = await loadSampler()
      const delay = getDelay(delayTime, delayIntensity)
      player.connect(delay).toMaster()
      this.setState({player,buttonLabel:'STOP'})
      setTimeout(this.playIt, 1000)

    } catch (e) {
      console.log(`Error in loading samples (App.js): ${e.message}`)
    }
  }

  render() {
    const {buttonClick, setDelayIntensity, setDelayTime, setDurations, setSpaces, setNotes, setOctaves, state: {buttonLabel,durations, delayTime, delayIntensity, notes, spaces, octaves}} = this
    return (

      <div className="player">
        <Button variant="outlined" onClick={buttonClick}>
          {buttonLabel}
        </Button>
        <Slider type={'range'} transmitValues={setOctaves} initialState={octaves} min={0} max={8}
                text={'Octave Range'}/>
        <Slider type={'range'} transmitValues={setDurations} initialState={durations} min={250} max={8000}
                text={'Note Duration'}/>
        <Slider type={'range'} transmitValues={setSpaces} initialState={spaces} min={100} max={3000} text={'Rests'}/>
        <Slider type={'range'} transmitValues={setNotes} initialState={notes} min={1} max={5} text={'Number of Notes'}/>
        <Slider type={'continuous'} transmitValues={setDelayTime} initialState={delayTime} min={.1} max={2.0}
                text={'Delay Time'}/>
        <Slider type={'continuous'} transmitValues={setDelayIntensity} initialState={delayIntensity} min={0.0} max={1.0}
                text={'Delay Intensity'}/>
      </div>
    )


  }

}

export default Player;
