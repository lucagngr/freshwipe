fetch('/api/servers')
    .then(response => response.json())
    .then(data => {
        const serverList = document.getElementById('server-list');
        data.data.forEach(server => {
            serverList.innerHTML += `
                <div class="server">
                    <h3>${server.attributes.name}</h3>
                    <p>Players: ${server.attributes.players}/${server.attributes.maxPlayers}</p>
                    <p>Address: ${server.attributes.ip}:${server.attributes.port}</p>
                </div>
            `;
        });
    })
    .catch(error => console.error('Error:', error));