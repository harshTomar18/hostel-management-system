// API Base URL - use environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Registration error:', err);
    return { status: 'error', message: 'Network or server error' };
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Login error:', err);
    return { status: 'error', message: 'Network or server error' };
  }
}

export async function getStudents() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students`);
    return await res.json();
  } catch (err) {
    console.error('Get students error:', err);
    return [];
  }
}

export async function createStudent(studentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return await res.json();
  } catch (err) {
    console.error('Create student error:', err);
    return { status: 'error', message: 'Network error' };
  }
}

export async function getComplaints() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/complaints`);
    return await res.json();
  } catch (err) {
    console.error('Get complaints error:', err);
    return [];
  }
}

export async function createComplaint(complaintData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData)
    });
    return await res.json();
  } catch (err) {
    console.error('Create complaint error:', err);
    return { status: 'error', message: 'Network error' };
  }
}

export async function updateComplaintStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/complaints/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    console.error('Update complaint error:', err);
    return { status: 'error', message: 'Network error' };
  }
}

export async function getNotices() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notices`);
    return await res.json();
  } catch (err) {
    console.error('Get notices error:', err);
    return [];
  }
}

export async function createNotice(noticeData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticeData)
    });
    return await res.json();
  } catch (err) {
    console.error('Create notice error:', err);
    return { status: 'error', message: 'Network error' };
  }
}

export async function getDashboardStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
    return await res.json();
  } catch (err) {
    console.error('Get stats error:', err);
    return {};
  }
}

export async function getRooms() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rooms`);
    return await res.json();
  } catch (err) {
    console.error('Get rooms error:', err);
    return [];
  }
}

export async function createRoom(roomData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roomData)
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Create room error:', err);
    return { status: 'error', message: 'Network or server error' };
  }
}

export async function updateStudent(id, studentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return await res.json();
  } catch (err) {
    console.error('Update student error:', err);
    return { status: 'error', message: 'Network error' };
  }
}

export async function updateRoom(id, roomData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
    return await res.json();
  } catch (err) {
    console.error('Update room error:', err);
    return { status: 'error', message: 'Network error' };
  }
}

export const updateNotice = async (id, noticeData) => {
  const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noticeData)
  });
  return response.json();
};

export async function getDashboardActivity() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/activity`);
    return await res.json();
  } catch (err) {
    console.error('Get activity error:', err);
    return [];
  }
}

export async function getDashboardChart() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/chart`);
    return await res.json();
  } catch (err) {
    console.error('Get chart error:', err);
    return [];
  }
}

export async function getStaff() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/staff`);
    return await res.json();
  } catch (err) {
    console.error('Get staff error:', err);
    return [];
  }
}
