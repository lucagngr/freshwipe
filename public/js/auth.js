document.addEventListener('DOMContentLoaded', () => {
  console.log('Auth script loaded');

  // Affichage du nom d'utilisateur dans la navbar
  const usernameSpan = document.getElementById('username');
  const userInfo = document.getElementById('user-info');
  const storedUsername = localStorage.getItem('username');

  if (usernameSpan && userInfo) {
    if (storedUsername) {
      usernameSpan.textContent = storedUsername;
      userInfo.style.display = 'flex';
    } else {
      userInfo.style.display = 'none';
    }
  }

  // Formulaire d'inscription
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const username = registerForm.querySelector('#username')?.value.trim();
        const email = registerForm.querySelector('#email')?.value.trim();
        const password = registerForm.querySelector('#password')?.value;

        if (!username || !email || !password) {
          alert("Tous les champs sont requis.");
          return;
        }

        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Inscription réussie !');
          window.location.href = '/login.html';
        } else {
          alert(`Erreur : ${data.error || 'Réponse invalide du serveur'}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    });
  }

  // Formulaire de connexion
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const username = loginForm.querySelector('#username')?.value.trim();
        const password = loginForm.querySelector('#password')?.value;

        if (!username || !password) {
          alert("Tous les champs sont requis.");
          return;
        }

        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('username', data.username);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('email', data.email);
          alert('Connexion réussie !');
          window.location.href = '/';
        } else {
          alert(`Erreur : ${data.error || 'Réponse invalide du serveur'}`);
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Erreur lors de la connexion. Veuillez réessayer.');
      }
    });
  }

  // Bouton de déconnexion
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      window.location.href = '/login.html';
    });
  }
});
