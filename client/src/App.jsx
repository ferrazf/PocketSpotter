//==========================================
// import libraries/modules
//==========================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grommet } from 'grommet';
// import './App.css';
//==========================================
// import files
//==========================================
import Routes from './containers/routes.jsx'
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
  //==========================================
  // States
  //==========================================
  const [ user, setUser ] = useState({});
  const [ workouts, setWorkout ] = useState([]);
  const [ messages, setMessage ] = useState('')
  const [ initialized, setInitialized ] = useState(false);
  const [ muscleGroup, setMuscleGroups ] = useState('');
  const [ muscle, setMuscles ] = useState('');
  const [ exercise, setExercise] = useState('');
  const [ workoutExercises, setWorkoutExercises] = useState([
    {
        "id": 4,
        "exercise_id": 1,
        "name": "Barbell Bench Press",
        "descr": "Main Muscle Worked: Chest.",
        "sets": 6,
        "reps": 10,
        "rest": 1,
        "muscle_group_id": 6,
        "muscle_group_name": "Chest"
    },
    {
        "id": 4,
        "exercise_id": 4,
        "name": "Standing Cable Lift",
        "descr": "Main Muscle Worked: Abdominals.",
        "sets": 6,
        "reps": 10,
        "rest": 1,
        "muscle_group_id": 1,
        "muscle_group_name": "Abdominals"
    }
 ])
 const [exercises, setExercises] = useState([
  {
      "id": 6,
      "muscle_group_id": 6,
      "name": "Barbell Bench Press more",
      "descr": "Main Muscle Worked: Chest."
  },
  {
      "id": 1,
      "muscle_group_id": 6,
      "name": "Barbell Bench Press",
      "descr": "Main Muscle Worked: Chest."
  }
])

  //==========================================
  // Functions
  //==========================================
  const isLoggedin = (user) => (user && user.hasOwnProperty('name')) ? true : false;
  const setError = (content) => {
    setMessage({
        type: 'error',
        content: `😱 Axios request failed: ${content}`
      });
  }

  const setOnLogin = async ( user ) => {
    setUser(user);
    try{

      const workoutUrl = `${url}/users/${user.id}/workouts`;

      const { data } = await axios.get(workoutUrl, workoutUrl);
      console.log(data)
      setWorkout(data);
      console.log(workouts)
    }catch (e){
      setError(e);
    }
  }

  const getMuscleGroup = (muscle) => {
    return muscleGroup.filter(group => group.name === muscle);
  }

  const getWorkoutExercises = (exercise) => {
    return workoutExercises.filter(group => group.name === exercise);
  }

  const updateExercise  = (workoutExercise) => {
    setExercise(workoutExercise)
  }

  const addExercise = (exercise) => {
    setWorkoutExercises([...workoutExercises, exercise])
  }
  // const isEmpty = (object) => {
  //   return Object.entries(object).length === 0 && object.constructor === Object;
  // }

  //==========================================
  // Events
  //==========================================
  useEffect(() => {
    try{
      if (!initialized) {
        axios.get(`${url}/muscles`)
          .then(({ data }) => {
            setMuscleGroups(data);
            setMuscles(data.map(muscle => muscle.name));
          });

        axios.get(`${url}/workouts`)
          .then(({ data }) => {
            setWorkout(data);
          });

        setInitialized(true);
      }
    }catch (e){
      setError(e);
    }
  })

  // show workout display with corrisponding exercises
  const viewWorkout = async (workout) => {
    console.log(workouts)
    console.log(workout)

    try{
      const response = await axios.get(`${url}/workouts/${workout}`);
      console.log(response.data)
    }catch (e){
      setError(e);
    }
  }

  // update exercise values
  const handleExerciseFormSubmit = async (evt) => {
    evt.preventDefault();
    const getExercise = getWorkoutExercises(evt.target.ExName.value)[0]

    const exercise ={
      sets: Number(evt.target.Sets.value),
      reps: Number(evt.target.Reps.value),
      rest: Number(evt.target.Rest.value),
    }

    try{
      const response = await axios.put(`${url}/workouts/${getExercise.id}/exercises/${getExercise.exercise_id}`, exercise);
      setWorkoutExercises(response.data)
    }catch (e){
      setError(e);
    }
  }

  // incase we let them create an exercise

  /*const handleExerciseFormSubmit = async (evt) => {
    evt.preventDefault();
    console.log("thing")
    const exercise ={
      muscle_group_id: getWorkoutExercises(evt.target.muscle.value)[0].id,
      name: evt.target.name.value,
      descr: evt.target.descr.value
    }

    evt.target.muscle.value = '';
    evt.target.name.value = '';
    evt.target.descr.value = '';

    try{
      const response = await axios.post(`${url}/exercises`, exercise);
      console.log(response)
      //set state
    }catch (e){
      setError(e);
    }
  }*/

  // update add display based on muscle group
  const updateMG = async (muscleGroup) => {
    const MG_id = getMuscleGroup(muscleGroup)[0].id
    try{
      const response = await axios.get(`${url}/muscles/${MG_id}/exercises`)
      setExercises(response.data)
    }catch (e){
      setError(e);
    }
  }
  const updateWorkout = async (id, updateWorkout) => {
    try{

      const { data } = await axios.put(`${url}/workouts/${id}`, updateWorkout);

      //set state
      const newWorkouts = workouts.map(workout => {
        if(workout.workout_id === data[0].id){
          workout.started_at = data[0].started_at;
          workout.finished_at = data[0].finished_at;
        }
        return workout;
      });
      setWorkout(newWorkouts);

    }catch (e){
      console.error(e);
      setError(e);
    }
  }

  const handleViewRegister = (username) => {
    return "Hello " + username;
  }

  const handleStartWorkout = (evt) => {
    evt.preventDefault();
    const id = Number(evt.target.name);
    const workout = { started_at: new Date() }
    updateWorkout(id, workout);
  }

  const handleFinishWorkout = (evt) => {
    evt.preventDefault();
    const id = Number(evt.target.name);
    const workout = { finished_at: new Date() }
    updateWorkout(id, workout);
  }

  //==========================================
  // Return
  //==========================================
  const message = messages && <Message message={messages} />;

  const workoutRoute = workouts.length && (
      <Routes
        url={url}
        setUser={setUser}
        workouts={workouts}
        handleViewRegister={handleViewRegister}
        handleExerciseFormSubmit={handleExerciseFormSubmit}
        handleStartWorkout={handleStartWorkout}
        handleFinishWorkout={handleFinishWorkout}
        setOnLogin={setOnLogin}
        workoutExercises={workoutExercises}
        updateExercise={updateExercise}
        exercises={exercises}
        exercise={exercise}
        muscle={muscle}
        updateMG={updateMG}
        addExercise={addExercise}
        viewWorkout={viewWorkout}
        isLoggedin={isLoggedin}
        setError={setError}
      />
    );

  const name = user.hasOwnProperty('name') && user.name;

  return (
    <Grommet plain>
      <Nav
        user={user}
        setUser={setUser}
        name={name}
        isLoggedin={isLoggedin}
      />
      {message}
      {/* {userRoute} */}
      {workoutRoute}


    </Grommet>
  );
}

export default App;