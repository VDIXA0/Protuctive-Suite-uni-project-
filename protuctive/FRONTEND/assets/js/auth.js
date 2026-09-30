// This file is the ONLY thing connecting your login.html form to the backend above.

// The base URL of your backend's auth routes. Change the port if yours is different.
const AUTH_API_BASE = 'http://localhost:5001/api/auth';

// Wait until the whole HTML page has loaded before touching any elements,
// otherwise document.getElementById() might return null because the element doesn't exist yet.
document.addEventListener('DOMContentLoaded', () => {

  // Grab references to the tab buttons and forms from login.html
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // --- Tab switching logic (just visual, no backend involved) ---
  if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');       // highlight the login tab
      registerTab.classList.remove('active');
      loginForm.classList.remove('hidden');   // show the login form
      registerForm.classList.add('hidden');   // hide the register form
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    });
  }

  // --- LOGIN form submission ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // stop the browser from doing a full page reload on submit

      // Pull the values the user typed into the form
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        // Send a POST request to the backend with the login info as JSON
        const response = await fetch(`${AUTH_API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // tells the server "this is JSON"
          body: JSON.stringify({ email, password })         // convert JS object into a JSON string
        });

        // Parse the JSON response the backend sent back
        const data = await response.json();

        // If the backend said it failed (wrong password, missing fields, etc.)
        if (!response.ok || !data.success) {
          alert(data.message || 'Login failed. Please check your email and password.');
          return; // stop here, don't redirect
        }

        // Success! Save the token and user info in the browser's storage.
        // localStorage persists even after closing the tab, so the user stays "logged in".
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // objects must be stringified

        alert('Login successful! Redirecting to your dashboard...');
        window.location.href = 'dashboard.html';
      } catch (error) {
        // This catches network failures -- e.g. the backend server isn't even running
        console.error('Login error:', error);
        alert('Could not reach the server. Please make sure the backend is running.');
      }
    });
  }

  // --- REGISTER form submission (same pattern as login) ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;

      try {
        const response = await fetch(`${AUTH_API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          alert(data.message || 'Registration failed. Please try again.');
          return;
        }

        alert('Registration successful! Please login.');
        registerForm.reset();  // clear the form fields
        loginTab.click();      // programmatically switch to the login tab
      } catch (error) {
        console.error('Registration error:', error);
        alert('Could not reach the server. Please make sure the backend is running.');
      }
    });
  }
});