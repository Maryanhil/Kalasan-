
let map;

function showSection(section) {
    const contentDiv = document.getElementById('content');

    switch (section) {
        case 'profile':
            contentDiv.innerHTML = `
                <div class="profile-container">
                    <img src="https://tse3.mm.bing.net/th?id=OIP.uCrIhgDYGnhBfmgGGx2P3AHaHa&pid=Api&P=0&h=220"/>
                    <div class="profile-details">
                        <h3>Marianne Gil</h3>
                        <p>Administrator</p>
                        <p>Email: marianne.gil@example.com</p>
                        <p>Last Login: September 19, 2024</p>
                    </div>
                    <div class="profile-actions">
        <a href="/edit-profile" class="action-button">Edit Profile</a>
        <a href="/change-password" class="action-button">Change Password</a>
        <a href="/logout" class="action-button">Logout</a>
    </div>
    </div>
                </div>
            `;
            break;
        case 'overview':
            contentDiv.innerHTML = `
                <div class="card">
                    <h3>Overview</h3>
                    <p>This is the overview section.</p>
                    <p>Here you can find a summary of the data and key metrics.</p>
                </div>
                <div class="card">
                    <h3>Summary Statistics</h3>
                    <p>Number of species recorded: 120</p>
                    <p>Total records: 450</p>
                </div>
                <div class="chart-container">
                    <canvas id="speciesChart"></canvas>
                </div>
            `;
            initializeChart();
            break;
        case 'map':
            contentDiv.innerHTML = '<h2>Map</h2><div id="map"></div>';
            initializeMap();
            break;
        case 'community':
            contentDiv.innerHTML = `
                <div class="card">
                    <h3>Community</h3>
                    <p>Connect with the community. Share your findings and collaborate.</p>
                </div>
                <div class="card">
                    <h3>Discussion Board</h3>
                    <p>Join the discussion and stay updated with the latest news.</p>
                </div>
            `;
            break;
        case 'records':
            contentDiv.innerHTML = `
                <div class="card">
                    <h3>Records</h3>
                    <p>Manage and view records of endemic tree species.</p>
                    <button onclick="viewRecords()">View Records</button>
                </div>
            `;
            break;
        case 'settings':
            contentDiv.innerHTML = `
                <div class="card">
                    <h3>Settings</h3>
                    <p>Adjust your settings and preferences.</p>
                    <button onclick="changeSettings()">Change Settings</button>
                </div>
            `;
            break;
        default:
            contentDiv.innerHTML = '<h2>Welcome</h2><p>Please select an option from the sidebar.</p>';
    }
}

function initializeMap() {
    if (!map) {
        map = L.map('map').setView([12.8797, 121.7740], 6); // Set the view to the Philippines
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    }
}

function initializeChart() {
    var ctx = document.getElementById('speciesChart').getContext('2d');

    var speciesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Species A', 'Species B', 'Species C', 'Species D'],
            datasets: [{
                label: 'Number of Records',
                data: [12, 19, 10, 9],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutBounce',
            },
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                },
                legend: {
                    labels: {
                        color: '#004d40',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });

    document.getElementById('speciesChart').onclick = function() {
        speciesChart.update();
    };
}

function viewRecords() {
    alert('Viewing records...');
}

function changeSettings() {
    alert('Changing settings...');
}

function logout() {
    alert('Log out?');
    window.location.href = '/login.html';  // Redirect to login page after logging out
}
function addRecord() {
    const name = document.getElementById('species').value;
    const lat = document.getElementById('location').value.split(',')[0];
    const lng = document.getElementById('location').value.split(',')[1];

    fetch('/api/addRecord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lat, lng }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Optionally, refresh the list of records
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateRecord() {
    const id = document.getElementById('update-id').value;
    const name = document.getElementById('update-species').value;
    const lat = document.getElementById('update-location').value.split(',')[0];
    const lng = document.getElementById('update-location').value.split(',')[1];

    fetch(`/api/updateRecord/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lat, lng }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Optionally, refresh the list of records
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteRecord() {
    const id = document.getElementById('delete-id').value;

    fetch(`/api/deleteRecord/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Optionally, refresh the list of records
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Default to overview section on page load
showSection('overview')


