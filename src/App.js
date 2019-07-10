import React, {useState, useEffect} from 'react';
import Tone from 'tone'
import {load,loadOneSample,loadSamples} from "./samples"





class App extends React.Component {


  possibles = ['A','C','E','F','A#']

  state = {
    sampler:null,
  }

  aleatoric = (limit, min = 0) => min + Math.floor(Math.random() * limit)

  playIt = () => {
    const {possibles,aleatoric,state:{sampler}} = this

    const numberOfNotes = aleatoric(3,1)
    const notes = []
    console.log('number of notes',numberOfNotes)
    for (let i = 0; i < numberOfNotes; i++) {
      const note = `${possibles[aleatoric(possibles.length)]}${aleatoric(6)}`
      console.log('playing ', note)
      if (sampler) sampler.triggerAttackRelease(note,3000)
    }
    const time = aleatoric(2000,500)
    console.log(time)
    setTimeout(this.playIt,time)

  }




 async componentDidMount() {
    try {
      const sampler = await load()
      this.setState({sampler})
      setTimeout(this.playIt,1000)
    } catch(e) {
      console.log(`Error in loading samples (App.js): ${e.message}`)
    }
  }

  render() {

    return (

      <div className="App">
        <button onClick={this.blip}>Blip</button>
      </div>
    )


  }

}

export default App;
