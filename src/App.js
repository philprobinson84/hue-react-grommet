import React from "react";
import { Grommet } from 'grommet';
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

class HueLights extends React.Component {
  render() {
    return (
      <Lights />
    );
  }
}

function App() {
  return (
    <Grommet theme={theme}>
      <HueLights />  
    </Grommet>
     
  );
}

export default App;
