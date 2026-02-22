import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const handleDeleteTask = (taskId, isCompleted = false) => {
    if (isCompleted) {
      setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
    } else {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleDragStart = (e, task, isCompleted) => {
    setDraggedTask({ ...task, fromCompleted: isCompleted });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnTodo = (e) => {
    e.preventDefault();
    if (draggedTask && draggedTask.fromCompleted) {
      // Move from completed back to todo
      setCompletedTasks(completedTasks.filter(task => task.id !== draggedTask.id));
      setTasks([...tasks, { ...draggedTask, completed: false }]);
    }
    setDraggedTask(null);
  };

  const handleDropOnCompleted = (e) => {
    e.preventDefault();
    if (draggedTask && !draggedTask.fromCompleted) {
      // Move from todo to completed
      setTasks(tasks.filter(task => task.id !== draggedTask.id));
      setCompletedTasks([...completedTasks, { ...draggedTask, completed: true }]);
    }
    setDraggedTask(null);
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1 className="title">My Todo List</h1>
        
        <div className="input-section">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="add-button" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

        <div 
          className="tasks-list"
          onDragOver={handleDragOver}
          onDrop={handleDropOnTodo}
        >
          <h2 className="section-title">📋 To Do</h2>
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className="task-item"
                draggable
                onDragStart={(e) => handleDragStart(e, task, false)}
              >
                <span className="task-text">{task.text}</span>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteTask(task.id, false)}
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div 
          className="completed-section"
          onDragOver={handleDragOver}
          onDrop={handleDropOnCompleted}
        >
          <h2 className="section-title">✅ Done</h2>
          {completedTasks.length === 0 ? (
            <p className="empty-state-done">Drag tasks here to mark as complete</p>
          ) : (
            <div className="completed-tasks-list">
              {completedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="task-item completed-task"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, true)}
                >
                  <span className="task-text completed-text">{task.text}</span>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteTask(task.id, true)}
                    aria-label="Delete task"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
