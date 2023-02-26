import React from 'react';
import { useState, useEffect } from 'react';
import pencilimg from '../../Assets/redpencil.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import paperball from '../../Assets/paperball.png'
import Axios from 'axios'
import uuid from 'react-uuid';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


const Storage = () => {
    const [databaseChoice, setDatabaseChoice] = useState('local');
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


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
                        id: uuid(),
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

    // function handleDeleteClick(id) {
    //     const removeItem = tasks.filter((taskInput) => {
    //         return taskInput.id !== id;
    //     });
    //     setTasks(removeItem);
    // }


    function handleClear(id) {
        if (databaseChoice === 'local') {
            const clearedItems = tasks.filter(() => {
                return (localStorage.clear())
            });
            setTasks(clearedItems)
        }


        // function handleClear() {
        //     if (databaseChoice === 'local') {
        //         const delteAll = localStorage.clear(()  => {
        //            return delteAll;

        //         });
        //      setTasks(tasks)
        //     }  
        // }

        else if (databaseChoice === "Mysql") {
            Axios.delete('http://localhost:3004/api/clear').then((response) => {
                console.log(response)
                setTasks(
                    tasks.filter((id) => {
                        return id !== id;
                    })
                );
            });
        };
    }






    const updateTask = (idToUpdate) => {
        const newTodoItems = [...tasks];

        // const item = newTodoItems[id];
        const item = newTodoItems.find(({ id }) => id === idToUpdate);
        // console.log(newTodoItems)
        // console.log(item)
        // console.log(idToUpdate)
        const taskIndex = newTodoItems.indexOf(item)
        // console.log(taskIndex)
        let newTextInput = prompt(`update ${item.text}?`, item.text);

        if (databaseChoice === "local") {
            if (newTextInput === null || newTextInput === "") {
                return;
            } else {
                item.text = newTextInput;

            }
            setTasks(newTodoItems);
        }
        else if (databaseChoice === "Mysql") {
            Axios.put("http://localhost:3004/api/update", { text: newTextInput, id: idToUpdate }).then(
                (response) => {
                    if (newTextInput === null || newTextInput === "") {
                        return;
                    } else {
                        item.text = newTextInput;
                        console.log(newTextInput)
                        console.log(idToUpdate)
                    }
                    setTasks(newTodoItems);
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
                // console.log(response.data)

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
                onClick={handleClear}
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
                                    <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  
 
                                    <button className='edit' onClick={() => updateTask(task.id)}>
                                        <FontAwesomeIcon className='icons' icon={faPenToSquare} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    );

}





export default Storage;