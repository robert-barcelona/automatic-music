import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `${value}`;
}

const  RangeSlider = (props) => {
  const {transmitValues, initialState, text, min, max} = props
  console.log(initialState)
  const classes = useStyles();
  const [value, setValue] = React.useState(initialState);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    transmitValues(newValue)
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {text}
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        min={min}
        max={max}
      />
    </div>
  );
}

export default RangeSlider
