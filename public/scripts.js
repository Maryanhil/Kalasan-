const map = L.map('map').setView([0, 0], 2); // Adjust latitude and longitude to your region

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch('data/trees.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(tree => {
      L.marker([tree.lat, tree.lng]).addTo(map)
        .bindPopup(tree.name);
    });
  })
  .catch(error => console.error('Error loading the tree data:', error));

  