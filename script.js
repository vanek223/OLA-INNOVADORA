// Filter apartments
function filterApartments() {
    const locationFilter = document.getElementById('location').value;
    const guestsFilter = document.getElementById('guests').value;
    const priceFilter = document.getElementById('price').value;
    
    const apartments = document.querySelectorAll('.apartment-card');
    
    apartments.forEach(apartment => {
        const location = apartment.getAttribute('data-location');
        const guests = parseInt(apartment.getAttribute('data-guests'));
        const price = parseInt(apartment.getAttribute('data-price'));
        
        let showApartment = true;
        
        // Location filter
        if (locationFilter !== 'all' && location !== locationFilter) {
            showApartment = false;
        }
        
        // Guests filter
        if (guestsFilter !== 'all') {
            if (guestsFilter === '1-2' && guests > 2) {
                showApartment = false;
            } else if (guestsFilter === '3-4' && (guests < 3 || guests > 4)) {
                showApartment = false;
            } else if (guestsFilter === '5+' && guests < 5) {
                showApartment = false;
            }
        }
        
        // Price filter
        if (priceFilter !== 'all') {
            if (priceFilter === '0-50' && price > 50) {
                showApartment = false;
            } else if (priceFilter === '50-100' && (price < 50 || price > 100)) {
                showApartment = false;
            } else if (priceFilter === '100-150' && (price < 100 || price > 150)) {
                showApartment = false;
            } else if (priceFilter === '150+' && price < 150) {
                showApartment = false;
            }
        }
        
        // Show or hide apartment
        if (showApartment) {
            apartment.classList.remove('hidden');
            apartment.style.animation = 'fadeIn 0.5s';
        } else {
            apartment.classList.add('hidden');
        }
    });
    
    // Scroll to results
    document.getElementById('apartments-grid').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Open booking modal
function openBookingModal(apartmentName, price) {
    const modal = document.getElementById('bookingModal');
    const modalInfo = document.getElementById('modalApartmentInfo');
    
    modalInfo.innerHTML = `
        <h3>${apartmentName}</h3>
        <p><strong>Цена:</strong> €${price} за ночь</p>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe apartment cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.apartment-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Initialize on page load
window.addEventListener('load', function() {
    // Any initialization code can go here
    console.log('Тенерифе Апартаменты загружен!');
});

// Card gallery navigation function
const cardGalleryState = {};

function changeCardImage(galleryId, direction) {
    const gallery = document.querySelector(`.image-gallery[data-gallery="${galleryId}"]`);
    const images = gallery.querySelectorAll('.gallery-image');
    const dots = document.querySelectorAll(`.gallery-dot[data-gallery="${galleryId}"]`);
    
    // Initialize current index if not exists
    if (!cardGalleryState[galleryId]) {
        cardGalleryState[galleryId] = 0;
    }
    
    // Remove active class from current image and dot
    images[cardGalleryState[galleryId]].classList.remove('active');
    dots[cardGalleryState[galleryId]].classList.remove('active');
    
    // Update index
    cardGalleryState[galleryId] += direction;
    
    // Loop back to start/end
    if (cardGalleryState[galleryId] >= images.length) {
        cardGalleryState[galleryId] = 0;
    } else if (cardGalleryState[galleryId] < 0) {
        cardGalleryState[galleryId] = images.length - 1;
    }
    
    // Add active class to new image and dot
    images[cardGalleryState[galleryId]].classList.add('active');
    dots[cardGalleryState[galleryId]].classList.add('active');
}