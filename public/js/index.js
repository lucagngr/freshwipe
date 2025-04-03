

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/servers')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const serverList = document.getElementById('server-list');
            serverList.innerHTML = ''; // Clear existing content

            data.data.forEach(server => {
                const serverDiv = document.createElement('div');
                serverDiv.classList.add('server');

                serverDiv.innerHTML = `
                    <h3>${server.attributes.name}</h3>
                    <p>Players: ${server.attributes.players}/${server.attributes.maxPlayers}</p>
                    <p>Address: ${server.attributes.ip}:${server.attributes.port}</p>
                `;
                serverList.appendChild(serverDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

