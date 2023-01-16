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
    const [databaseList, setDatabaseList] = useState([]); 


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
                    text: taskInput
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
        let todoObj = { id: id.taskInput, text: newItem };

        newTodoItems.splice(id, 1, todoObj);
        if (newItem === null || newItem === "") {
            return;
        } else {
            item.taskInput = newItem;
        }
        setTasks(newTodoItems);

    };

    const addTodo = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3004/api/create',
            { task: taskInput }).then(() => {
                setDatabaseList([
                    ...databaseList,
                    {
                      task: taskInput,
                     
                    },
                  ]);
                });
              };

    const getTaskList = () => {
        Axios.get('http://localhost:3004/api/task').then((response) => {
            setDatabaseList(response.data)
            
        });
    };

    const deleteTodo = (id) => {
        Axios.delete(`http://localhost:3004/api/delete/${id}`, tasks.id);
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
            <form className='search' onSubmit= {handleFormSubmit}> 
                <input className='bar'
                    name="taskInput"
                    type="text"
                    placeholder="add to-do"
                    value={taskInput}
                    onChange={handleInputChange}
                />
            </form>

 {databaseChoice === 'local' ?
   ( 
                    <div className='white-bgr'> <ul className='whole-list'>
                        {tasks.map((taskInput, text) => (
                            <li className='task-list' key={taskInput.id}> {taskInput.text}  {console.log(taskInput.text)}
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
                    </div>)
                : (
                    <div className='white-bgr'> <ul className='whole-list'>
             
                        {databaseList.map((id, task) => (
                         
                        <li className='task-list' key={task.id}> {id.task}  {console.log(id)}
                          <div className='button-change'>   
                                <button className='delete' onClick={() => deleteTodo(task.id)}>
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
                ) }
        </div>
    );

                }




export default Storage;