document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth script loaded');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = {
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                };

                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Inscription réussie !');
                    window.location.href = '/login.html';
                } else {
                    alert(`Erreur : ${data.error}`);
                }
            } catch (error) {
                console.error('Erreur lors de l\'inscription:', error);
                alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = {
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                };

                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Connexion réussie !');
                    window.location.href = '/';
                } else {
                    alert(`Erreur : ${data.error}`);
                }
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                alert('Erreur lors de la connexion. Veuillez réessayer.');
            }
        });
    }
});