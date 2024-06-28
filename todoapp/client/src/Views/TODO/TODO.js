import React, { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import axios from 'axios';

export function TODO() {
    const [newTodo, setNewTodo] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [todoData, setTodoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);



    const getTodo = async () => {
        const options = {
            method: "GET",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            }
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    };

    const addTodo = () => {
        const options = {
            method: "POST",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo,
                description: taskDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => [...prevData, response.data.newTodo]);
                setNewTodo('');
                setTaskDescription('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.filter(todo => todo._id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id);
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                title: newTodo,
                description: newDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
                setEditingTodoId(null);
                setNewTodo('');
                setNewDescription('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEdit = (id, currentTitle, currentDescription) => {
        setEditingTodoId(id);
        setNewTodo(currentTitle);
        setNewDescription(currentDescription);
    };

    const handleSave = (id) => {
        updateTodo(id);
    };


    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                
                    <input
                        className={Styles.inputTodo}
                        type='text'
                        placeholder='Enter the task'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                        
                    />
                    <input
                        className={Styles.inputTodo}
                        type='text'
                        placeholder='Enter the description for the task'
                        value={taskDescription}
                        onChange={(event) => {
                            setTaskDescription(event.target.value);
                        }}
                        
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                        }}
                    >
                        + New Todo
                    </button>
                    
                
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry) => (
                            <div key={entry._id} className={Styles.todo}>
                                <input
                                    type='checkbox'
                                    checked={entry.done}
                                    
                                />
                                {editingTodoId === entry._id ? (
                                    // Display edit inputs
                                    <>
                                        <input
                                            
                                            type='text'
                                            placeholder='Edit Task Title'
                                            value={newTodo}
                                            onChange={(event) => setNewTodo(event.target.value)}
                                            style={{
                                                width: '100%',
                                                margin: '10px 0',
                                                height: '40px',
                                                fontSize: '16px',
                                                padding: '10px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <input
                                            className={Styles.taskEditInput}
                                            type='text'
                                            placeholder='Edit Task Description'
                                            value={newDescription}
                                            onChange={(event) => setNewDescription(event.target.value)}
                                            style={{
                                                width: '100%',
                                                margin: '10px 0',
                                                height: '40px',
                                                fontSize: '16px',
                                                padding: '10px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <button
                                            className={Styles.saveButton}
                                            onClick={() => handleSave(entry._id)}
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    // Display todo title and description
                                    <>
                                        <span><b>Task:</b>  {entry.title}</span>
                                       
                                        <span><b>Description:</b>{entry.description}</span>
                                        <button
                                            className={Styles.editButton}
                                            onClick={() => handleEdit(entry._id, entry.title, entry.description)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={Styles.deleteButton}
                                            onClick={() => deleteTodo(entry._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>
    );
}