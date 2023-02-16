import React from 'react';
import { useState, useEffect } from 'react';
import pencilimg from '../../Assets/redpencil.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import paperball from '../../Assets/paperball.png'
import Axios from 'axios'



const Storage = () => {
    const [databaseChoice, setDatabaseChoice] = useState('local');
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");



    function updateDataBase() {
        if (databaseChoice === 'local') {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else if (databaseChoice === 'Mysql') {
            //getTaskList();
            //setTaskListDatabase
        }
    }



    useEffect(() => {
        getTaskList(databaseChoice);
    }, []);

    useEffect(() => {
        if (tasks.length !== 0) {
            updateDataBase();
        }
    }, [tasks]);


    function handleInputChange(e) {
        setTaskInput(e.target.value);
    }
    function handleFormSubmit(e) {
        e.preventDefault();
        if (taskInput !== "") {
            if (databaseChoice === 'local') {
                setTasks([
                    ...tasks,
                    {
                        id: tasks.length,
                        text: taskInput
                    }
                ]);

            } else if (databaseChoice === 'Mysql') {
                console.log(taskInput)
                Axios.post('http://localhost:3004/api/create',
                    { text: taskInput }).then(() => {
                        setTasks([
                            ...tasks,
                            {
                                text: taskInput,
                            },
                        ]);
                    });
            };
        }
        setTaskInput("");
    }


    function switchDatabase() {
        var choice;
        if (databaseChoice === 'Mysql') {
            setDatabaseChoice("local")
            choice = "local"

        } else if (databaseChoice === "local") {
            setDatabaseChoice("Mysql")
            choice = "Mysql"
        }
        getTaskList(choice);
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

        let newItem = prompt(`update ${item.text}?`, item.text);
        let todoObj = { id: id, text: newItem };
        newTodoItems.splice(id, 1, todoObj);
         console.log(todoObj)
        if (databaseChoice === "local") {

            if (newItem === null || newItem === "") {
                return;
            } else {
                item.tasks = newItem;
            } setTasks(newTodoItems);
            console.log(todoObj)

        } else if (databaseChoice === "Mysql") {
            Axios.put("http://localhost:3004/api/update", { text: newTodoItems, id: id.item }).then(
                (response) => {
                    setTasks([...tasks, 
                        {   id: id, 
                            text: newTodoItems }]);
                }
            )
        }
    }


    // const addTodo = (e) => {

    //     Axios.post('http://localhost:3004/api/create',
    //         { task: taskInput }).then(() => {
    //             setDatabaseList([
    //                 ...databaseList,
    //                 {
    //                     task: taskInput,

    //                 },
    //             ]);
    //         });
    // };

    const getTaskList = (choice) => {
        if (choice === 'local') {
            const savedTasks = localStorage.getItem("tasks");
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks))
                // console.log(savedTasks)
            }
        } else if (choice === 'Mysql') {
            Axios.get('http://localhost:3004/api/task').then((response) => {
                setTasks(response.data)
                console.log(response.data)

            })
        };
    };

    const deleteTask = (id, choice) => {
        if (choice === "local") {
            const removeItem = tasks.filter((taskInput) => {
                return taskInput.id !== id;
            });
            setTasks(removeItem);

        } else if (choice === "Mysql") {
            Axios.delete(`http://localhost:3004/api/delete/${id}`).then((response) => {
                console.log(response)
                setTasks(
                    tasks.filter((task) => {
                        return task.id !== id;
                    })
                );
            });
        };
    }

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
                <input className='bar'
                    name="taskInput"
                    type="text"
                    placeholder="add to-do"
                    value={taskInput}
                    onChange={handleInputChange}
                />
            </form>


            <div className='white-bgr'>
                {tasks !== [] &&
                    <ul className='whole-list'>
                        {tasks.map((task) => (

                            <li className='task-list' key={Math.random()}> {task.text}
                                <div className='button-change'>
                                    <button className='delete' onClick={() => deleteTask(task.id, databaseChoice)}>
                                        <FontAwesomeIcon className='icons' icon={faTrashCan} />
                                    </button>
                                    <button className='edit' onClick={() => updateTask(task.id)}>
                                        <FontAwesomeIcon className='icons' icon={faPenToSquare} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                }
            </div>

            {/* <div className='white-bgr'> <ul className='whole-list'>
             
                        {databaseList.map((id, task) => (
                         
                        <li className='task-list' key={task.id}> {id.task}  
                          <div className='button-change'>   
                                <button className='delete' onClick={() => deleteTodo(id.task)}>
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
                ) } */}
        </div>
    );

}




export default Storage;