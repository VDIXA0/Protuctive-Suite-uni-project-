// This page is the simplest possible demo of: sessions (are we still logged
// in?), logout (actually invalidating the token server-side), and
// authorization (a non-admin gets rejected by the backend, not just hidden
// by the frontend).

const AUTH_API_BASE = 'http://localhost:5001/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  // No token = no session. Bounce back to login instead of showing a broken page.
  if (!token || !userJson) {
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(userJson);

  document.getElementById('welcome-msg').textContent = `Welcome, ${user.name}`;
  const roleLine = document.getElementById('role-line');
  roleLine.innerHTML = `Signed in as ${user.email} — role: <span class="role-badge ${user.role}">${user.role}</span>`;

  // --- LOGOUT ---
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      // Tell the backend to blacklist this token, so it can't be reused
      // even if someone got hold of it later.
      await fetch(`${AUTH_API_BASE}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Even if the backend call fails (e.g. server down), we still clear
      // the local session below, so the user isn't stuck.
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });

  // --- TRY THE ADMIN-ONLY ENDPOINT ---
  // Every logged-in user can click this. What happens next depends entirely
  // on their role, as decided by the BACKEND (requireAdmin.js) -- not by
  // hiding the button, which would be trivial to bypass.
  document.getElementById('try-admin-btn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${AUTH_API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        // Expected outcome for a regular user: 403 Forbidden
        alert(`Access denied (${response.status}): ${data.message}`);
        return;
      }

      // Expected outcome for an admin: the full user list
      const panel = document.getElementById('admin-panel');
      const list = document.getElementById('admin-users-list');
      list.innerHTML = data.users
        .map(u => `<div>#${u.id} — ${u.name} (${u.email}) — ${u.role}</div>`)
        .join('');
      panel.style.display = 'block';
    } catch (error) {
      console.error('Admin request error:', error);
      alert('Could not reach the server. Please make sure the backend is running.');
    }
  });
});
