import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const HomePage = () => {
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <Container fluid className="p-4 p-md-5 bg-primary text-white text-center">
        <h1 className="display-4 fw-bold">TaskMaster</h1>
        <p className="lead fs-4">Organize your life, one task at a time.</p>
        <p>A simple, intuitive, and powerful way to manage your daily to-do list.</p>
        <Link to="/register">
          <Button variant="light" size="lg" className="w-100 w-md-auto mt-3">Get Started for Free</Button>
        </Link>
      </Container>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Features</h2>
        <Row className="g-4">
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-ui-checks-grid fs-1 text-primary"></i>
                <Card.Title className="mt-3">Easy Task Management</Card.Title>
                <Card.Text>
                  Create, update, and delete tasks with an intuitive interface. Keep track of everything you need to do.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-kanban fs-1 text-primary"></i>
                <Card.Title className="mt-3">Status Tracking</Card.Title>
                <Card.Text>
                  Move tasks between 'pending', 'in-progress', and 'completed' to visualize your workflow.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <i className="bi bi-people-fill fs-1 text-primary"></i>
                <Card.Title className="mt-3">Admin Oversight</Card.Title>
                <Card.Text>
                  Powerful admin tools to manage users and oversee all tasks in the system.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
