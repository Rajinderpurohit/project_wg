// import React, { useState, useEffect, useContext } from 'react';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';
import '../ResponsiveFixes.css';
// import { AuthContext } from '../context/AuthContext';

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusToUpdate, setStatusToUpdate] = useState('pending');
  // const { user } = useContext(AuthContext);

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for the current task being edited or created
  const [currentTask, setCurrentTask] = useState({ title: '', description: '' });
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const fetchTasks = async (page) => {
    try {
      const res = await api.get(`/tasks?page=${page}&limit=5`);
      setTasks(res.data.data);
      setTotalPages(res.data.pagination.pages || 1);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  // Modal Handlers
  const handleShowCreateModal = () => {
    setCurrentTask({ title: '', description: '' });
    setShowCreateModal(true);
  };
  
  const handleShowEditModal = (task) => {
    setCurrentTask(task);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentTask({ title: '', description: '' });
    setTaskToDelete(null);
  };

  // CRUD Handlers
  const handleCreateTask = async () => {
    try {
      await api.post('/tasks', currentTask);
      handleCloseModals();
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await api.put(`/tasks/${currentTask._id}`, currentTask);
      handleCloseModals();
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      handleCloseModals();
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  // Selection Handlers
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
    const newSelectedTasks = new Map();
    if (selectedTasks.size !== tasks.length) {
        tasks.forEach(task => newSelectedTasks.set(task._id, true));
    }
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
      <div className="row g-2 mb-4">
        <div className="col-12 col-lg-auto mb-2 mb-lg-0">
          <Button variant="primary" onClick={handleShowCreateModal} className="responsive-btn">
            <i className="bi bi-plus-lg me-2"></i>Create New Task
          </Button>
        </div>
        <div className="col-12 col-lg-auto mb-2 mb-lg-0">
          <Form.Select 
            value={statusToUpdate}
            onChange={(e) => setStatusToUpdate(e.target.value)}
            className="responsive-input"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </div>
        <div className="col-12 col-lg-auto">
          <Button onClick={handleBulkUpdate} variant="success" className="responsive-btn">
            Update Selected <span className="badge bg-light text-dark ms-2">{selectedTasks.size}</span>
          </Button>
        </div>
      </div>

      <div className="table-responsive mb-3">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{width: '5%'}}>
                <Form.Check 
                  type="checkbox"
                  onChange={handleSelectAll} 
                  checked={tasks.length > 0 && selectedTasks.size === tasks.length}
                />
              </th>
              <th>Task Title</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Last Updated By</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className={selectedTasks.has(task._id) ? 'table-primary' : ''}>
                <td>
                  <Form.Check 
                    type="checkbox" 
                    checked={selectedTasks.has(task._id)}
                    onChange={() => handleSelectTask(task._id)} 
                  />
                </td>
                <td>
                    <div className="fw-bold">{task.title}</div>
                    <small className="text-muted">{task.description}</small>
                </td>
                <td>{task.createdBy?.name || '-'}</td>
                <td>{formatDate(task.createdAt)}</td>
                <td>{task.updatedBy?.name || '-'}</td>
                <td>{formatDate(task.updatedAt)}</td>
                <td>
                  <span className={`badge rounded-pill ${
                    task.status === 'completed' ? 'bg-success' :
                    task.status === 'in-progress' ? 'bg-warning text-dark' : 'bg-secondary'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-grid gap-2 d-lg-flex justify-content-center align-items-center">
                    <Button variant="outline-primary" size="sm" className="w-100 w-lg-auto mb-2 mb-lg-0 me-lg-2" onClick={() => handleShowEditModal(task)}>
                        <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" className="w-100 w-lg-auto" onClick={() => handleShowDeleteModal(task)}>
                        <i className="bi bi-trash-fill"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {totalPages > 1 &&
            <div className="mt-4 d-flex justify-content-end">
                <nav>
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Button variant="link" onClick={() => setCurrentPage(page)} className="page-link">
                        {page}
                        </Button>
                    </li>
                    ))}
                </ul>
                </nav>
            </div>
        }

      {/* Create Task Modal */}
      <Modal show={showCreateModal} onHide={handleCloseModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={currentTask.title} 
                onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={currentTask.description}
                onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>Close</Button>
          <Button variant="primary" onClick={handleCreateTask}>Save Task</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={currentTask.title} 
                onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={currentTask.description}
                onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>Close</Button>
          <Button variant="primary" onClick={handleUpdateTask}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to delete the task: <strong>{taskToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteTask}>Delete Task</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskDashboard;
