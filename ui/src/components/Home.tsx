import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from './Header'
import { Tasks } from './Tasks'
import CreateTask from './CreateTask'
import { saveService} from '../services/saveService'

function Home() {

  const [tasks, setTasks] = useState([])
  const [numberOfTasks, setNumberOfTasks] = useState<number>(0)
  const [isTaskEdited, setTaskEdited] = useState(false)

  const saveService = new saveService();

  useEffect(() => {
    saveService.getAllTasks().then(tasks => {
        console.log(tasks)
        setTasks(tasks)
      });
  }, [numberOfTasks, isTaskEdited])


  function delTask(taskId: number) {
    saveService.deleteTask(taskId).then(response => {
        console.log(response)
        setNumberOfTasks(numberOfTasks - 1)
      });
  }

  function taskCreated() {
    setNumberOfTasks(numberOfTasks + 1)
  }

  function taskEdited(res: any) {
     setTaskEdited(res)
  }
    
  return (
    <div className="App">
      <Header></Header>
      <div className="container mrgnbtm">
        <div className="row">
          <div className="col-md-12">
              <CreateTask taskCreated={taskCreated}></CreateTask>
          </div>
        </div>
      </div>
      <div className="container mrgnbtm">
        <Tasks tasks={tasks} deleteTask={delTask} taskEdited={taskEdited}></Tasks>
     </div> 
  </div>
  );
}

export default Home;
