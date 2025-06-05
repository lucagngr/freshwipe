document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId');
  const serverList = document.getElementById('server-list');

  // Récupération des favoris
  let favoriteIds = [];
  if (userId) {
    try {
      const favRes = await fetch(`/api/favorites/${userId}`);
      const favData = await favRes.json();
      favoriteIds = favData.map(fav => fav.serverId);
    } catch (error) {
      console.error("Erreur récupération favoris :", error);
    }
  }

  const fetchServers = (filters = {}) => {
    const queryParams = new URLSearchParams({
      minPlayers: filters.minPlayers || 100,
      search: filters.search || ''
    });

    fetch(`/api/servers/official?${queryParams}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        serverList.innerHTML = '';

        data.data.forEach(server => {
          const serverDiv = document.createElement('div');
          serverDiv.classList.add('server');

          serverDiv.innerHTML = `
            <h3>${server.attributes.name}</h3>
            <div class="server-rating">
                <span class="star" data-value="1">☆</span>
                <span class="star" data-value="2">☆</span>
                <span class="star" data-value="3">☆</span>
                <span class="star" data-value="4">☆</span>
                <span class="star" data-value="5">☆</span>
            </div>
            <p>Players: ${server.attributes.players}/${server.attributes.maxPlayers}</p>
            <p>Address: ${server.attributes.ip}:${server.attributes.port}</p>
          `;

          // Bouton favoris
          const favBtn = document.createElement('button');
          const isFav = favoriteIds.includes(server.id);

          if (isFav) {
            favBtn.textContent = 'Déjà en favori';
            favBtn.disabled = true;
          } else {
            favBtn.textContent = 'Ajouter aux favoris';
            favBtn.addEventListener('click', async () => {
              try {
                const res = await fetch('/api/favorites', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, serverId: server.id })
                });

                if (res.ok || res.status === 409) {
                  favBtn.disabled = true;
                  favBtn.textContent = 'Déjà en favori';
                } else {
                  console.error('Erreur lors de l’ajout aux favoris.');
                }
              } catch (error) {
                console.error('Erreur ajout favori :', error);
              }
            });
          }

          serverDiv.appendChild(favBtn);

          // Notation
          const ratingDiv = serverDiv.querySelector('.server-rating');
          const stars = ratingDiv.querySelectorAll('.star');
          const serverId = server.id;

          fetch(`/api/rating/${serverId}`)
            .then(res => res.json())
            .then(noteData => {
              const moyenne = document.createElement('p');
              moyenne.classList.add('server-global-average');
              if (noteData.average !== null) {
                moyenne.textContent = `Note moyenne : ${noteData.average} / 5 (${noteData.count} vote(s))`;
              } else {
                moyenne.textContent = 'Note moyenne : aucune';
              }
              serverDiv.appendChild(moyenne);
            })
            .catch(err => console.error('Erreur récupération moyenne :', err));

          const savedRating = parseInt(localStorage.getItem(`rating_${serverId}`));
          if (!isNaN(savedRating)) updateStars(savedRating);

          function updateStars(value) {
            stars.forEach(star => {
              const sValue = parseInt(star.getAttribute('data-value'));
              star.classList.toggle('active', sValue <= value);
            });
          }

          stars.forEach(star => {
            star.addEventListener('click', async () => {
              const value = parseInt(star.getAttribute('data-value'));

              if (!userId) {
                alert("Vous devez être connecté pour noter un serveur.");
                return;
              }

              updateStars(value);
              localStorage.setItem(`rating_${serverId}`, value);

              try {
                const response = await fetch('/api/rating', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, serverId, value })
                });

                if (!response.ok) {
                  const err = await response.json();
                  console.error('Erreur du serveur :', err);
                }
              } catch (e) {
                console.error('Erreur sauvegarde rating :', e);
              }
            });
          });

          serverList.appendChild(serverDiv);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  fetchServers();

  document.getElementById('applyFilters').addEventListener('click', () => {
    const filters = {
      minPlayers: document.getElementById('minPlayers').value,
      search: document.getElementById('searchQuery').value
    };
    fetchServers(filters);
  });
});
