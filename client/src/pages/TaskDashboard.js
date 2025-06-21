// import React, { useState, useEffect, useContext } from 'react';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
// import { AuthContext } from '../context/AuthContext';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusToUpdate, setStatusToUpdate] = useState('pending');
  // const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const fetchTasks = async (page) => {
    try {
      const res = await api.get(`/tasks?page=${page}&limit=5`);
      setTasks(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleSelectTask = (taskId) => {
    const newSelectedTasks = new Map(selectedTasks);
    if (newSelectedTasks.has(taskId)) {
      newSelectedTasks.delete(taskId);
    } else {
      newSelectedTasks.set(taskId, true);
    }
    setSelectedTasks(newSelectedTasks);
  };

  const handleSelectAll = () => {
    const newSelectedTasks = new Map(selectedTasks);
    const allOnPageSelected = tasks.every(task => selectedTasks.has(task._id));

    tasks.forEach(task => {
      if (allOnPageSelected) {
        newSelectedTasks.delete(task._id);
      } else {
        newSelectedTasks.set(task._id, true);
      }
    });
    setSelectedTasks(newSelectedTasks);
  };

  const handleBulkUpdate = async () => {
    const taskIds = Array.from(selectedTasks.keys());
    if (taskIds.length === 0) {
      alert('Please select at least one task to update.');
      return;
    }
    try {
      await api.put('/tasks/bulk-update-status', { taskIds, status: statusToUpdate });
      setSelectedTasks(new Map());
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Failed to bulk update tasks', error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <select 
            value={statusToUpdate}
            onChange={(e) => setStatusToUpdate(e.target.value)}
            className="form-select me-2" style={{width: '170px'}}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleBulkUpdate} className="btn btn-success">
            Update Selected <span className="badge bg-light text-dark ms-2">{selectedTasks.size}</span>
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th style={{width: '5%'}}>
                <input 
                  type="checkbox"
                  className="form-check-input"
                  onChange={handleSelectAll} 
                  checked={tasks.length > 0 && tasks.every(task => selectedTasks.has(task._id))}
                />
              </th>
              <th>Title</th>
              <th style={{width: '20%'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className={selectedTasks.has(task._id) ? 'table-active' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    className="form-check-input"
                    checked={selectedTasks.has(task._id)}
                    onChange={() => handleSelectTask(task._id)} 
                  />
                </td>
                <td>{task.title}</td>
                <td>
                  <span className={`badge ${
                    task.status === 'completed' ? 'bg-success' :
                    task.status === 'in-progress' ? 'bg-warning text-dark' : 'bg-secondary'
                  }`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button 
                  onClick={() => setCurrentPage(page)}
                  className="page-link"
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default TaskDashboard;
