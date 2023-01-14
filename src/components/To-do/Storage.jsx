import React from 'react';
import { useState, useEffect } from 'react';
import pencilimg from '../../Assets/redpencil.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import paperball from '../../Assets/paperball.png'
import Axios from 'axios'



const Storage = () => {

    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            return JSON.parse(savedTasks);
        } else {
            return [];
        }
    });
    const [databaseChoice, setDatabaseChoice] = useState('local');
    const [taskInput, setTaskInput] = useState("");
    const [taskDatabaseList, setTaskDatabaseList] = useState([]);

    useEffect(() => {
        if (databaseChoice === 'local') {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else if (databaseChoice === 'Mysql') {
            getTaskList();
        }
    }, [tasks]);


    function handleInputChange(e) {
        setTaskInput(e.target.value);
    }
    function handleFormSubmit(e) {
        e.preventDefault();

        if (taskInput !== "") {
            setTasks([
                ...tasks,
                {
                    id: tasks.length,
                    task: taskInput
                }
            ]);
        }

        setTaskInput("");

    }

    function switchDatabase() {
        if (databaseChoice === 'Mysql') {
            setDatabaseChoice("local")
        } else if (databaseChoice === "local") {
            setDatabaseChoice("Mysql")
        }
    }

    function handleDeleteClick(id) {
        const removeItem = tasks.filter((taskInput) => {
            return taskInput.id !== id;
        });
        setTasks(removeItem);
    }

    function handleClear() {
        const clearedItems = tasks.filter((taskInput) => {
            return (localStorage.removeItem(taskInput))
        });

        setTasks(clearedItems)
    }


    const updateTask = (id) => {
        const newTodoItems = [...tasks];

        const item = newTodoItems[id];

        let newItem = prompt(`update task ${item.id + 1}?`, item.taskInput);
        let todoObj = { id: id.taskInput, task: newItem };

        newTodoItems.splice(id, 1, todoObj);
        if (newItem === null || newItem === "") {
            return;
        } else {
            item.taskInput = newItem;
        }
        setTasks(newTodoItems);

    };

    const addTodo = () => {
        Axios.post('http://localhost:3004/api/create',
            { task: taskInput }).then(() => {
                setTaskDatabaseList([
                  ...taskDatabaseList,
                  {
                    task: taskInput,
                  },
                ]);
              });
            };

    const getTaskList = () => {
        Axios.get('http://localhost:3004/api/task').then((response) => {
           setTaskDatabaseList(response.data)
            console.log(response)
        });

    };

    const deleteTodo = () => {
        Axios.delete('http://localhost:3004/api/delete/:id', taskInput.id);
    };


    return (
         
       <div>

            <button onClick={switchDatabase}> {databaseChoice === 'local' ? "switch to Mysql" : "switch to local"} </button>
           
            <img
                className='paper-ball'
                title='clear'
                src={paperball}
                onClick={() => handleClear(taskInput)}       
            />


            <img
                className='pencil_img'
                src={pencilimg}
            />
            <form className='search' onSubmit={handleFormSubmit}>
                <button className='bd_add' onClick={addTodo}>Click me</button>
                <input className='bar'
                    name="taskInput"
                    type="task"
                    placeholder="add to-do"
                    value={taskInput}
                    onChange={handleInputChange}
                />
            </form>
          {databaseChoice === 'local' ?  
                <div className='white-bgr'> <ul className='whole-list'>
                    {tasks.map((taskInput) => (
                        <li className='task-list' key={taskInput.id}> {taskInput.task}
                            <div className='button-change'>
                                <button className='delete' onClick={() => handleDeleteClick(taskInput.id)}>
                                    <FontAwesomeIcon className='icons' icon={faTrashCan} />
                                </button>
                                <button className='edit' onClick={() => updateTask(taskInput.id)}>
                                    <FontAwesomeIcon className='icons' icon={faPenToSquare} />
                                </button>


                            </div>
                        </li>

                    ))}
                </ul>
                </div>
    
               : <div className='white-bgr'> <ul className='whole-list'>
                     <button onClick={getTaskList}>database list</button>
                     {taskDatabaseList.map((taskInput, id) => {
                          return <li key={id}> {taskInput.task} </li>
                           })
                        }
                        {/* <li className='task-list' key={taskInput.id}> {taskInput.task}
                        <li className='task-list' > {getTaskList} */}
                        {console.log(tasks)}
                            {/* <div className='button-change'>
                                <button className='delete' onClick={() => deleteTodo(taskInput.id)}>
                                    <FontAwesomeIcon className='icons' icon={faTrashCan} />
                                </button>
                                <button className='edit' onClick={() => updateTask(taskInput.id)}>
                                    <FontAwesomeIcon className='icons' icon={faPenToSquare} />
                                </button>


                            </div> */}
                        {/* </li> */}

                   
                </ul>
                </div>}
        </div>
    );

};




export default Storage;