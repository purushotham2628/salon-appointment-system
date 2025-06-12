document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    // Login form event listener
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button event listener
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Refresh button event listener
    document.getElementById('refreshBtn').addEventListener('click', loadAppointments);
});

function checkAuthStatus() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    
    if (isAuthenticated === 'true') {
        showAdminPanel();
        loadAppointments();
    } else {
        showLoginForm();
    }
}

function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminToken', result.token);
            showAdminPanel();
            loadAppointments();
            showMessage('Login successful!', 'success');
        } else {
            showMessage('Invalid username or password!', 'error');
        }
        
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Please try again.', 'error');
        
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
}

function handleLogout() {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminToken');
    showLoginForm();
    document.getElementById('loginForm').reset();
    showMessage('Logged out successfully!', 'success');
}

async function loadAppointments() {
    const token = sessionStorage.getItem('adminToken');
    
    if (!token) {
        showLoginForm();
        return;
    }
    
    try {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.textContent = 'Loading...';
        refreshBtn.disabled = true;
        
        const response = await fetch('/api/appointments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            handleLogout();
            return;
        }
        
        const appointments = await response.json();
        
        displayAppointments(appointments);
        updateStats(appointments);
        
        refreshBtn.textContent = 'Refresh';
        refreshBtn.disabled = false;
        
    } catch (error) {
        console.error('Error loading appointments:', error);
        showMessage('Failed to load appointments. Please try again.', 'error');
        
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.textContent = 'Refresh';
        refreshBtn.disabled = false;
    }
}

function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No appointments found.</p>';
        return;
    }
    
    appointmentsList.innerHTML = appointments.map(appointment => `
        <div class="appointment-card">
            <div class="appointment-header">
                <span class="appointment-name">${appointment.name}</span>
                <span class="status-badge status-${appointment.status}">${appointment.status}</span>
            </div>
            
            <div class="appointment-details">
                <div><strong>Email:</strong> ${appointment.email}</div>
                <div><strong>Phone:</strong> ${appointment.phone}</div>
                <div><strong>Service:</strong> ${appointment.service}</div>
                <div><strong>Date:</strong> ${formatDate(appointment.date)}</div>
                <div><strong>Time:</strong> ${formatTime(appointment.time)}</div>
                <div><strong>Booked:</strong> ${formatDateTime(appointment.created_at)}</div>
            </div>
            
            ${appointment.status === 'pending' ? `
                <div class="appointment-actions">
                    <button class="confirm-btn" onclick="confirmAppointment(${appointment.id})">
                        Confirm
                    </button>
                    <button class="reject-btn" onclick="rejectAppointment(${appointment.id})">
                        Reject
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateStats(appointments) {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    
    document.getElementById('totalAppointments').textContent = total;
    document.getElementById('pendingAppointments').textContent = pending;
    document.getElementById('confirmedAppointments').textContent = confirmed;
}

async function confirmAppointment(id) {
    if (!confirm('Are you sure you want to confirm this appointment?')) {
        return;
    }
    
    const token = sessionStorage.getItem('adminToken');
    
    try {
        const response = await fetch('/api/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });
        
        if (response.status === 401) {
            handleLogout();
            return;
        }
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Appointment confirmed successfully!', 'success');
            loadAppointments(); // Reload appointments
        } else {
            showMessage('Failed to confirm appointment. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error confirming appointment:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function rejectAppointment(id) {
    if (!confirm('Are you sure you want to reject this appointment?')) {
        return;
    }
    
    const token = sessionStorage.getItem('adminToken');
    
    try {
        const response = await fetch('/api/reject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });
        
        if (response.status === 401) {
            handleLogout();
            return;
        }
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Appointment rejected successfully!', 'success');
            loadAppointments(); // Reload appointments
        } else {
            showMessage('Failed to reject appointment. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message at the top of the visible container
    const activeContainer = document.getElementById('loginContainer').style.display !== 'none' 
        ? document.getElementById('loginContainer')
        : document.querySelector('.container');
    
    activeContainer.insertBefore(messageDiv, activeContainer.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
    
    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility functions
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Auto-refresh appointments every 30 seconds (only when authenticated)
setInterval(() => {
    if (sessionStorage.getItem('adminAuthenticated') === 'true') {
        loadAppointments();
    }
}, 30000);