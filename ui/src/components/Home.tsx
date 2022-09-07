import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from './Header'
import { SaveService} from '../services/SaveService'
import { Settings, ISettings } from './Settings';

function Home() {

  // const [tasks, setTasks] = useState([])
  // const [numberOfTasks, setNumberOfTasks] = useState<number>(0)
  // const [isTaskEdited, setTaskEdited] = useState(false)

  const saveService = new SaveService();

  // useEffect(() => {
  //   saveService.getAllTasks().then(tasks => {
  //       console.log(tasks)
  //       setTasks(tasks)
  //     });
  // }, [numberOfTasks, isTaskEdited])


  let onSettingsChange = (input : ISettings) => {

  }
    
  return (
    <div className="App">
      <Header></Header>
      <div className="container mrgnbtm">
        <div className="row">
          <div className="col-md-4">
              <Settings onSettingsChange={onSettingsChange} />
          </div>
          <div className="col-md-8">
          
          </div>
        </div>
      </div>
  </div>
  );
}

export default Home;
