import React from "react";
import { Grommet, Grid, Nav, Anchor } from 'grommet';
import Lights from './Lights';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  return (
    <Grommet theme={theme} full>
      <Lights />  
    </Grommet>
     
  );
}

export default App;
