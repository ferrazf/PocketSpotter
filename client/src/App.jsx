//==========================================
// import libraries/modules
//==========================================
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Grommet } from 'grommet';
// import './App.css';
//==========================================
// import files
//==========================================
import Main from './containers/main.jsx'
import Nav from "./components/Nav.jsx";
import Message from './components/Message.jsx';

//==========================================
// Gobal var
//==========================================
const url = process.env.REACT_APP_SERVER_URL;

//==========================================
// App
//==========================================
function App(props) {
  const [ name, setName ] = useState("kobi")
  const [ workouts, setWorkout ] = useState( 
    {1:["Chest","Back"],
    2:["Rest"],
    3:["Legs"],
    4:["chest","back"], 
    5:["shoulders", "arms"],
    6:["rest"],
    7:["chest"]}
  );
  const [ messages, setMessage ] = useState(0)
  //==========================================
  // Events
  //==========================================
  const handleExerciseFormSubmit = async (evt) => {
    evt.preventDefault();

    const exercise ={
      muscle: this.getMuscleGroup(evt.target.muscle.value)[0].id,
      name: evt.target.name.value,
      descr: evt.target.descr.value
    }

    evt.target.muscle.value = '';
    evt.target.name.value = '';
    evt.target.descr.value = '';

    try{
      const response = await axios.post(`${url}/exercises`, exercise);
      console.log('response---------------------------------');
      console.log(response.data);
      //set state
    }catch (e){
      setMessage(
        {
          type: 'error',
          content: `😱 Axios request failed: ${e}`
        }
      )
    }
  }

  //==========================================
  // Return
  //==========================================
  
  const message = messages && <Message message={messages}/>

  return (
    <Grommet plain>
      <Nav  name={name} />
      {message}
      <Main workouts={workouts} handleExerciseFormSubmit={handleExerciseFormSubmit}/>
    </Grommet>
  );
}

export default App;