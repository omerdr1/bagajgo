// Map initialization
let map;
let markers = [];

// Image dimensions
const imageWidth = 1200;  // Görüntünün gerçek genişliği
const imageHeight = 800;  // Görüntünün gerçek yüksekliği

// Sample location data
const locations = [
    {
        id: 1,
        name: "Rainbow Stairs Storage Spot",
        type: "Printing Store",
        coordinates: [400, 300], // Taksim bölgesi
        rating: 4.9,
        reviews: 20,
        price: "€2.90",
        openUntil: "21:00",
        distance: "2.1 mi",
        image: "images/store.jpg"
    },
    {
        id: 3,
        name: "Kadıköy Safe Storage",
        type: "Locker Service",
        coordinates: [600, 400], // Kadıköy bölgesi
        rating: 4.7,
        reviews: 89,
        price: "€2.50",
        openUntil: "22:00",
        distance: "1.8 mi",
        image: "images/store.jpg"
    },
    {
        id: 4,
        name: "Beşiktaş Bag Drop",
        type: "Shop Store",
        coordinates: [450, 250], // Beşiktaş bölgesi
        rating: 4.6,
        reviews: 45,
        price: "€2.75",
        openUntil: "20:00",
        distance: "3.2 mi",
        image: "images/store.jpg"
    },
    {
        id: 5,
        name: "Üsküdar Storage Point",
        type: "Convenience Store",
        coordinates: [550, 350], // Üsküdar bölgesi
        rating: 4.8,
        reviews: 67,
        price: "€2.60",
        openUntil: "21:30",
        distance: "2.7 mi",
        image: "images/store.jpg"
    },
    {
        id: 6,
        name: "Bakırköy Luggage Hub",
        type: "Shopping Mall",
        coordinates: [300, 450], // Bakırköy bölgesi
        rating: 4.7,
        reviews: 112,
        price: "€3.00",
        openUntil: "22:00",
        distance: "4.1 mi",
        image: "images/store.jpg"
    }
];

// Initialize Map
function initMap() {
    // Create map instance
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 1,
        zoomControl: false,
        attributionControl: false
    });

    // Get container dimensions
    const mapContainer = document.getElementById('map');
    const containerWidth = mapContainer.clientWidth;
    const containerHeight = mapContainer.clientHeight;

    // Original image dimensions and ratio
    const originalWidth = 1200;
    const originalHeight = 800;
    const imageRatio = originalWidth / originalHeight;

    // Calculate bounds to maintain aspect ratio
    let bounds;
    const containerRatio = containerWidth / containerHeight;

    if (containerRatio > imageRatio) {
        // Container is wider than image ratio
        const height = containerHeight;
        const width = height * imageRatio;
        bounds = [[0, 0], [originalHeight, width * (originalHeight / height)]];
    } else {
        // Container is taller than image ratio
        const width = containerWidth;
        const height = width / imageRatio;
        bounds = [[0, 0], [height * (originalWidth / width), originalWidth]];
    }

    // Add the image overlay
    const imageOverlay = L.imageOverlay('images/istanbul-map.png', bounds).addTo(map);
    
    // Set map bounds and initial view
    map.fitBounds(bounds, {
        padding: [0, 0],
        animate: false
    });

    // Add zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add markers for each location
    locations.forEach(location => {
        // Create custom marker icon
        const markerIcon = L.divIcon({
            className: 'marker',
            html: '<i class="fas fa-suitcase"></i>',
            iconSize: [30, 30]
        });

        // Calculate marker position based on the new bounds
        const x = (location.coordinates[0] / originalWidth) * bounds[1][1];
        const y = (location.coordinates[1] / originalHeight) * bounds[1][0];

        // Create marker
        const marker = L.marker([y, x], {
            icon: markerIcon
        }).addTo(map);

        // Add click event
        marker.on('click', () => {
            showLocationDetails(location);
        });

        markers.push(marker);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        map.invalidateSize();
        
        // Recalculate bounds on resize
        const newContainerWidth = mapContainer.clientWidth;
        const newContainerHeight = mapContainer.clientHeight;
        const newContainerRatio = newContainerWidth / newContainerHeight;

        let newBounds;
        if (newContainerRatio > imageRatio) {
            const height = newContainerHeight;
            const width = height * imageRatio;
            newBounds = [[0, 0], [originalHeight, width * (originalHeight / height)]];
        } else {
            const width = newContainerWidth;
            const height = width / imageRatio;
            newBounds = [[0, 0], [height * (originalWidth / width), originalWidth]];
        }

        map.fitBounds(newBounds, {
            padding: [0, 0],
            animate: false
        });
    });
}

// Show location details
function showLocationDetails(location) {
    const detailsElement = document.getElementById('locationDetails');
    
    // Update location details content
    detailsElement.querySelector('.store-type').textContent = location.type;
    detailsElement.querySelector('.store-name').textContent = location.name;
    detailsElement.querySelector('.score').textContent = location.rating;
    detailsElement.querySelector('.status').textContent = `· Open Closes at ${location.openUntil} ·`;
    detailsElement.querySelector('.distance').textContent = location.distance;
    
    // Show the details panel
    detailsElement.style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Back button
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', () => {
        document.getElementById('locationDetails').style.display = 'none';
    });

    // Location button
    const locationBtn = document.querySelector('.location-btn');
    locationBtn.addEventListener('click', () => {
        // Center the map
        const bounds = map.getBounds();
        const center = bounds.getCenter();
        map.setView(center, 0);
    });

    // Initialize map
    initMap();
}); 