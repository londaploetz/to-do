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
    const [task, setTask] = useState("");

    const [todoTasks, setTodoTasks] = useState([]);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(e) {
        setTask(e.target.value);
    }
    function handleFormSubmit(e) {
        e.preventDefault();

        if (task !== "") {
            setTasks([
                ...tasks,
                {
                    id: tasks.length,
                    text: task
                }
            ]);
        }

        setTask("");

    }


    function handleDeleteClick(id) {
        const removeItem = tasks.filter((task) => {
            return task.id !== id;
        });
        setTasks(removeItem);
    }

    function handleClear() { 
        const clearedItems = tasks.filter((task) => {
            return (localStorage.removeItem(task))
        });

        setTasks(clearedItems)
    }


    const updateTask = (id) => {
        const newTodoItems = [...tasks];

        const item = newTodoItems[id];

        let newItem = prompt(`update task ${item.id + 1}?`, item.task);
        let todoObj = { id: id, text: newItem };

        newTodoItems.splice(id, 1, todoObj);
        if (newItem === null || newItem === "") {
            return;
        } else {
            item.task = newItem;
        }
        setTasks(newTodoItems);

    };

    const addTodo = () => {
        Axios.post('http://localhost:3004/api/create',
            { task: task }).then(() => {
                console.log('sucess');
            });
    };

    const getTaskList = () => {
        Axios.get('http://localhost:3004/api/task').then((response) => {
            setTodoTasks(response.data);
        });

    };

    const deleteTodo = () => {
        Axios.delete('http://localhost:3004/api/delete/:id', task.id);
    };


    return (
        <div> <div>
            <button className='seeall' onClick={getTaskList}>show list
            </button>

            {todoTasks.map((key, val) => {
                return <div key={val.tasks}> {val.tasks} </div>
            })}
        </div>
            <img
                className='paper-ball'
                title='clear'
                src={paperball}
                onClick={() => handleClear(task)}
            />


            <img
                className='pencil_img'
                src={pencilimg}
            />
            <form className='search' onSubmit={handleFormSubmit}>
                <button className='bd_add' onClick={addTodo}>Click me</button>
                <input className='bar'
                    name="task"
                    type="text"
                    placeholder="add to-do"
                    value={task}
                    onChange={handleInputChange}
                />
            </form>
            <div className='white-bgr'> <ul className='whole-list'>
                {tasks.map((task) => (
                    <li className='task-list' key={task.id}> {task.text}
                        <div className='button-change'>
                            <button className='delete' onClick={() => handleDeleteClick(task.id) | deleteTodo(task.id)}>
                                <FontAwesomeIcon className='icons' icon={faTrashCan} />
                            </button>
                            <button className='edit' onClick={() => updateTask(task.id)}>
                                <FontAwesomeIcon className='icons' icon={faPenToSquare} />
                            </button>
                            

                        </div>
                    </li>

                ))}
            </ul>
            </div>

        </div>
    );

};




export default Storage;