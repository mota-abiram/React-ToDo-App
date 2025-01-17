import React, { useState, useEffect } from 'react';
import './Todo.css';

const Todo = () => {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e) => {
        e.preventDefault();
        if (input.trim() !== '') {
            if (editingId !== null) {
                setTodos(todos.map(todo => 
                    todo.id === editingId 
                        ? { ...todo, text: input }
                        : todo
                ));
                setEditingId(null);
            } else {
                const newTodo = {
                    id: new Date().getTime(),
                    text: input,
                    completed: false,
                    createdAt: new Date().toLocaleString()
                };
                setTodos([...todos, newTodo]);
            }
            setInput('');
        }
    };

    const deleteTodo = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTodos(todos.filter((todo) => todo.id !== id));
        }
    };

    const toggleComplete = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id 
                ? { ...todo, completed: !todo.completed }
                : todo
        ));
    };

    const enterEditMode = (id) => {
        const todoToEdit = todos.find((todo) => todo.id === id);
        setInput(todoToEdit.text);
        setEditingId(id);
    };

    return (
        <div className='todo-container'>
            <h2>ToDo List</h2>
            <form onSubmit={addTodo} className="todo-form">
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What needs to be done?"
                    className="todo-input"
                />
                <button type="submit" className="todo-button">
                    {editingId !== null ? 'Update' : 'Add'}
                </button>
            </form>

            <div className="todo-stats">
                <p>Total tasks: {todos.length}</p>
                <p>Completed: {todos.filter(todo => todo.completed).length}</p>
            </div>

            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <div className="todo-content">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo.id)}
                                className="todo-checkbox"
                            />
                            <span className="todo-text">{todo.text}</span>
                            <span className="todo-date">{todo.createdAt}</span>
                        </div>
                        <div className="todo-actions">
                            <button 
                                onClick={() => enterEditMode(todo.id)}
                                className="edit-btn"
                                disabled={todo.completed}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => deleteTodo(todo.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
