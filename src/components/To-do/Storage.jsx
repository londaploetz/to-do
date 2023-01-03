import React from 'react';
import { useState, useEffect } from 'react';
import pencilimg from '../../Assets/redpencil.png';


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

    const updateTask = (id) => {
        const newTodoItems = [...tasks];
       console.log(newTodoItems) 
        const item = newTodoItems[id]; 
       
          let newItem = prompt (item.task); 
          let todoObj = {id: id, text: newItem};
       
        newTodoItems.splice(id, 1, todoObj);
        if (newItem === null || newItem === "") {
        return;
        } else {
        item.task = newItem;
        }
        setTasks(newTodoItems);
        };
    return (
        <div>
            <img
                className='pencil_img'
                src={pencilimg}
            />
            <form className='search' onSubmit={handleFormSubmit}>

                <input className='bar'
                    name="task"
                    type="text"
                    placeholder="add todo"
                    value={task}
                    onChange={handleInputChange}
                />
            </form>
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id}> {task.text} <button className='delete' onClick={() => handleDeleteClick(task.id)}>X</button>
                    <button className='edit' onClick={() => updateTask(task.id)}>edit</button></li>

                ))}
            </ul>
        </div>
    );

};




export default Storage;