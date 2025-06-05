document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const list = document.getElementById('server-list');

  // Affichage infos utilisateur
  const usernameSpan = document.getElementById('display-username');
  const emailSpan = document.getElementById('display-email');
  if (usernameSpan && emailSpan) {
    usernameSpan.textContent = username || '';
    emailSpan.textContent = email || '';
  }

  // Formulaire édition
  const editBtn = document.getElementById('editAccountBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      document.getElementById('editAccountSection').style.display = 'block';
      document.getElementById('edit-username').value = username || '';
      document.getElementById('edit-email').value = email || '';
    });
  }

  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedData = {
        username: document.getElementById('edit-username').value,
        email: document.getElementById('edit-email').value,
        password: document.getElementById('edit-password').value
      };

      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error('Erreur mise à jour');

        alert('Compte mis à jour !');
        localStorage.setItem('username', updatedData.username);
        localStorage.setItem('email', updatedData.email);
        location.reload();
      } catch (err) {
        alert('Erreur : ' + err.message);
      }
    });
  }

  // Déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/';
    });
  }

  // Suppression du compte
  const deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      if (!userId) return;

      const confirmed = confirm('Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.');
      if (!confirmed) return;

      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        localStorage.clear();
        alert('Compte supprimé.');
        window.location.href = '/';
      } else {
        alert('Erreur lors de la suppression du compte.');
      }
    });
  }

  // Chargement des favoris
  if (!userId) {
    list.innerHTML = '<p>Vous devez être connecté pour voir vos favoris.</p>';
    return;
  }

  try {
    const favRes = await fetch(`/api/favorites/${userId}`);
    const favorites = await favRes.json();

    if (!favorites.length) {
      list.innerHTML = '<p>Aucun serveur en favori.</p>';
      return;
    }

    const serverRes = await fetch('/api/servers');
    const allServers = (await serverRes.json()).data;

    const userFavorites = allServers.filter(server =>
      favorites.find(f => f.serverId === server.id)
    );

    userFavorites.forEach(server => {
      const div = document.createElement('div');
      div.className = 'server';
      div.innerHTML = `
        <h3>${server.attributes.name}</h3>
        <p>Players: ${server.attributes.players}/${server.attributes.maxPlayers}</p>
        <p>Address: ${server.attributes.ip}:${server.attributes.port}</p>
        <button class="remove-fav">Supprimer</button>
      `;

      // Ajouter la moyenne de note
      fetch(`/api/rating/${server.id}`)
        .then(res => res.json())
        .then(noteData => {
          const averageText = document.createElement('p');
          averageText.className = 'server-average';
          if (noteData.average !== null) {
           averageText.textContent = `Note moyenne : ${noteData.average} / 5 (${noteData.count} vote(s))`;
          } else {
            averageText.textContent = 'Pas encore de note';
          }
          div.appendChild(averageText);
        });

      div.querySelector('.remove-fav').addEventListener('click', async () => {
        try {
          const res = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, serverId: server.id })
          });

          if (res.ok) {
            div.remove();
          } else {
            alert('Erreur lors de la suppression');
          }
        } catch (err) {
          console.error('Erreur suppression favori :', err);
        }
      });

      list.appendChild(div);
    });
  } catch (error) {
    console.error('Erreur chargement favoris:', error);
    list.innerHTML = '<p>Erreur lors du chargement des favoris.</p>';
  }
});


