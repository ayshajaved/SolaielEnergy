import { googleMapsConfig } from './googleMapsConfig.js';

function loadGoogleMapsAPI() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsConfig.apiKey}&callback=initMap&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

let map;
let markers = [];
let infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 31.5497, lng: 74.3436 }, // Lahore coordinates
    zoom: 12,
  });
  infoWindow = new google.maps.InfoWindow();
}

function geocodeLocation(location, radius) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: location, componentRestrictions: { country: 'PK' } }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const userLocation = results[0].geometry.location;
      searchInstallers(userLocation, radius);
    } else {
      alert("Could not find location in Pakistan.");
    }
  });
}

function searchInstallers(userLocation, radius) {
  const service = new google.maps.places.PlacesService(map); // Revert to PlacesService
  service.nearbySearch({
    location: userLocation,
    radius: radius * 1000, // Convert km to meters
    keyword: 'solar panel installer OR solar energy company'
  }, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      displayResults(results, userLocation);
    } else {
      alert("No solar installers found nearby.");
    }
  });
}

// Add this function after your existing functions
function downloadCSV(results) {
    const csvContent = [
        ['Name', 'Address', 'Rating'], // CSV header
        ...results.map(place => [
            place.name,
            place.vicinity,
            place.rating || 'N/A'
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar_installers.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function displayResults(results, userLocation) {
  clearMarkers();
  const bounds = new google.maps.LatLngBounds();
  const listContainer = document.getElementById('installer-list');
  
  // Updated controls with consistent styling
  listContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 15px;">
      <a href="#" id="sort-by-rating" class="animated-button type--C" style="transform: scale(0.7);">
          <div class="button__line"></div>
          <div class="button__line"></div>
          <span class="button__text">SORT BY RATING</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
      </a>
      <a href="#" id="download-csv" class="animated-button type--C" style="transform: scale(0.7);">
          <div class="button__line"></div>
          <div class="button__line"></div>
          <span class="button__text">DOWNLOAD LIST</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
      </a>
    </div>
    <div id="filtered-results"></div>
  `;

  // Updated event listeners
  document.getElementById('sort-by-rating').addEventListener('click', (e) => {
    e.preventDefault();
    updateListView(results, userLocation, 'rating');
  });

  // Initial display
  updateListView(results, userLocation, 'none');

  const userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    icon: { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
  });
  markers.push(userMarker);
  bounds.extend(userLocation);

  results.forEach(place => {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      icon: { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }
    });
    markers.push(marker);
    bounds.extend(place.geometry.location);

    // Fetch detailed information for each place
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: place.place_id }, (details, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.setContent(`
            <div>
              <strong>${details.name}</strong><br>
              ${details.vicinity}<br>
              Rating: ${details.rating || 'N/A'}<br>
              Contact: ${details.formatted_phone_number || 'N/A'}<br>
              Website: ${details.website ? `<a href="${details.website}" target="_blank" class="website-link">${details.website}</a>` : 'N/A'}
            </div>
          `);
          infoWindow.open(map, marker);
        });

        // Add to list view with highlighted website
        const listItem = document.createElement('div');
        listItem.className = 'p-4 border-b';
        listItem.innerHTML = `
          <strong>${details.name}</strong><br>
          ${details.vicinity}<br>
          Rating: ${details.rating || 'N/A'}<br>
          Contact: ${details.formatted_phone_number || 'N/A'}<br>
          Website: ${details.website ? `<a href="${details.website}" target="_blank" class="website-link">${details.website}</a>` : 'N/A'}
        `;
        listContainer.appendChild(listItem);
      } else {
        console.error('Failed to fetch details for place:', place.place_id);
      }
    });
  });

  map.fitBounds(bounds);
  toggleView('map');

  // Update the download button click handler
  document.getElementById('download-csv').addEventListener('click', (e) => {
    e.preventDefault();
    downloadCSV(results);
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function toggleView(view) {
  const mapElement = document.getElementById('map');
  const listElement = document.getElementById('installer-list');
  const toggleButton = document.getElementById('toggle-view-btn');
  const buttonText = toggleButton.querySelector('.button__text');

  if (view === 'map') {
    mapElement.style.display = 'block';
    listElement.style.display = 'none';
    buttonText.textContent = 'VIEW LIST';
  } else {
    mapElement.style.display = 'none';
    listElement.style.display = 'block';
    buttonText.textContent = 'VIEW MAP';
  }
}

document.getElementById('find-installers-btn').addEventListener('click', () => {
  const location = document.getElementById('location-input').value;
  const radius = parseInt(document.getElementById('radius-input').value, 10);
  if (radius >= 1 && radius <= 50) {
    geocodeLocation(location, radius);
  } else {
    alert("Please enter a valid radius between 1 and 50 km.");
  }
});

document.getElementById('toggle-view-btn').addEventListener('click', () => {
  const currentView = document.getElementById('map').style.display === 'block' ? 'list' : 'map';
  toggleView(currentView);
});

window.initMap = initMap;

window.onload = loadGoogleMapsAPI;


// Add this new function for updating the list view
function updateListView(results, userLocation, sortType) {
  const filteredResults = document.getElementById('filtered-results');
  let sortedResults = [...results];

  // Apply sorting
  if (sortType === 'rating') {
    sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Update markers and list view
  markers.forEach(marker => {
    if (marker.icon.url.includes('blue-dot')) return; // Skip user marker
    const isVisible = sortedResults.some(place => 
      place.geometry.location.equals(marker.getPosition())
    );
    marker.setVisible(isVisible);
  });

  // Update the list view
  filteredResults.innerHTML = '';
  sortedResults.forEach(place => {
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: place.place_id }, (details, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const listItem = document.createElement('div');
        listItem.className = 'p-4 border-b';
        listItem.innerHTML = `
          <strong>${details.name}</strong><br>
          ${details.vicinity}<br>
          Rating: ${details.rating || 'N/A'}<br>
          Contact: ${details.formatted_phone_number || 'N/A'}<br>
          Website: ${details.website ? `<a href="${details.website}" target="_blank" class="website-link">${details.website}</a>` : 'N/A'}
        `;
        filteredResults.appendChild(listItem);
      }
    });
  });
}