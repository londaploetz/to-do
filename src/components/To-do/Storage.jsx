import React from 'react';
import './todo.css';
import { useState, useEffect } from "react";
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
              id: tasks.length + 1,
              text: task.trim()
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
                    <li key= {task.id}> {task.text} <button onClick={() => handleDeleteClick(task.id)}>X</button></li>
                    
                ))}
            </ul>
        </div>
    );

};




export default Storage;