import React, {useState, useEffect} from 'react';
import Tone from 'tone'
import UnmuteButton from 'unmute'

import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

import {loadSampler, loadSynth, loadOneSample, loadSamples} from "./samples"

import Slider from './RangeSlider'


class Player extends React.Component {


  setOctaves = (octaves) => this.setState({octaves})
  setDurations = (durations) => this.setState({durations})
  setSpaces = (spaces) => this.setState({spaces})
  setNotes = (notes) => this.setState({notes})


  possibles = ['F', 'G#', 'C', 'C#', 'D#', 'G#', 'F']
  possibles = ['A', 'C#', 'D', 'F', 'A#', 'G', 'E']


  state = {
    player: null,
    octaves: [0, 6],
    durations: [500, 3000],
    spaces: [500, 2000],
    notes: [1, 3],
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
      console.log(note,duration)
    }
    const time = aleatoric(spaces[1], spaces[0])
    setTimeout(this.playIt, time)

  }



  startPlay = async () => {
    try {
      UnmuteButton({context:Tone.context,title:'hello'})

      const player = await loadSynth()

      this.setState({player})
      setTimeout(this.playIt, 1000)
    } catch (e) {
      console.log(`Error in loading samples (App.js): ${e.message}`)
    }
  }

  render() {
    const {startPlay, setDurations, setSpaces, setNotes, setOctaves, state: {durations, notes, spaces, octaves}} = this
    return (

      <div className="App">
        <Button variant="contained" onClick={startPlay}>
          Play
        </Button>
        <Slider transmitValues={setOctaves} initialState={octaves} min={0} max={8} text={'Octave Range'}/>
        <Slider transmitValues={setDurations} initialState={durations} min={250} max={8000} text={'Note Duration'}/>
        <Slider transmitValues={setSpaces} initialState={spaces} min={100} max={3000} text={'Rests'}/>
        <Slider transmitValues={setNotes} initialState={notes} min={1} max={5} text={'Number of Notes'}/>
      </div>
    )


  }

}

export default Player;
