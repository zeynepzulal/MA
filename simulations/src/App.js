import React, {useState} from 'react';
import './App.css';
import TwoBodySimulation from './components/TwoBodySimulation';
import ThreeBodySimulation from './components/ThreeBodySimulation';
import NBodySimulation from './components/NBodySimulation';

const App = () => {

  const [simulationType, setSimulationType] = useState((null));

  return (
    <div>
      <button onClick={()=> setSimulationType('TwoBody')}>Two-Body Simulation</button>
      <button onClick={()=> setSimulationType('ThreeBody')}>Three-Body Simulation</button>
      <button onClick={()=> setSimulationType('N-Body')}>N-Body Simulation</button>

      {simulationType === 'TwoBody' && <TwoBodySimulation/>}
      {simulationType === 'ThreeBody' && <ThreeBodySimulation/>}
      {simulationType === 'NBody' && <NBodySimulation/>}
    </div>
  )

}

export default App;