const API_BASE_URL = 'http://localhost:5000'; // Base URL for your backend

// Function to store the token in localStorage
function storeToken(token) {
  localStorage.setItem('token', token);
}

// Function to get the token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Register a new user
async function registerUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful!');
    } else {
      console.error(data);
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Error connecting to the server.');
  }
}

// Login user and store token
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Login successful!');
      storeToken(data.token); // Save the token
    } else {
      console.error(data);
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Error connecting to the server.');
  }
}

// Load all tasks
async function loadTasks() {
  try {
    const token = getToken();
    if (!token) {
      alert('Please login first.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${task.title}</strong> - ${task.priority} - ${task.deadline}
        <button class="edit" onclick="editTask('${task._id}')">Edit</button>
        <button class="delete" onclick="deleteTask('${task._id}')">Delete</button>
      `;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Add a new task
document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const priority = document.getElementById('task-priority').value;
  const deadline = document.getElementById('task-deadline').value;

  try {
    const token = getToken();
    if (!token) {
      alert('Please login first.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, priority, deadline }),
    });

    if (response.ok) {
      alert('Task added successfully!');
      loadTasks();
    } else {
      const errorData = await response.json();
      console.error(errorData);
      alert(errorData.message || 'Failed to add task');
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }
});

// Delete a task
async function deleteTask(taskId) {
  try {
    const token = getToken();
    if (!token) {
      alert('Please login first.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert('Task deleted successfully!');
      loadTasks();
    } else {
      console.error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
