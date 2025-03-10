document.addEventListener('DOMContentLoaded', () => {
    const fetchServers = (filters = {}) => {
        const queryParams = new URLSearchParams({
            minPlayers: filters.minPlayers || 10,
            search: filters.search || ''
        });

        fetch(`/api/servers/official?${queryParams}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const serverList = document.getElementById('server-list');
                serverList.innerHTML = '';

                data.data.forEach(server => {
                    const serverDiv = document.createElement('div');
                    serverDiv.classList.add('server');

                    serverDiv.innerHTML = `
                        <h3>${server.attributes.name}</h3>
                        <p>Joueurs: ${server.attributes.players}/${server.attributes.maxPlayers}</p>
                        <p>IP: ${server.attributes.ip}:${server.attributes.port}</p>
                    `;
                    serverList.appendChild(serverDiv);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Initialiser avec les filtres par défaut
    fetchServers();

    // Gérer les filtres
    document.getElementById('applyFilters').addEventListener('click', () => {
        const filters = {
            minPlayers: document.getElementById('minPlayers').value,
            search: document.getElementById('searchQuery').value
        };
        fetchServers(filters);
    });
});