// Reviews System with Local Storage
class ReviewsSystem {
    constructor(apartmentSlug) {
        this.apartmentSlug = apartmentSlug;
        this.storageKey = `reviews_${apartmentSlug}`;
        this.reviews = this.loadReviews();
    }

    // Load reviews from localStorage
    loadReviews() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save reviews to localStorage
    saveReviews() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
    }

    // Add a new review
    addReview(name, rating, text) {
        const review = {
            id: Date.now(),
            name: name,
            rating: parseInt(rating),
            text: text,
            date: new Date().toLocaleDateString('ru-RU')
        };
        
        this.reviews.unshift(review); // Add to beginning
        this.saveReviews();
        return review;
    }

    // Get all reviews
    getReviews() {
        return this.reviews;
    }

   // Get average rating
    getAverageRating() {
        if (this.reviews.length === 0) return 0;
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / this.reviews.length).toFixed(1);
    }

    // Render reviews on page
    renderReviews() {
        const container = document.getElementById('reviewsList');
        if (!container) return;

        if (this.reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>${typeof t === 'function' ? t('noReviews') : 'Пока нет отзывов. Будьте первым!'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">
                        <div class="review-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h4>${this.escapeHtml(review.name)}</h4>
                            <p class="review-date">${review.date}</p>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${this.renderStars(review.rating)}
                    </div>
                </div>
                <p class="review-text">${this.escapeHtml(review.text)}</p>
            </div>
        `).join('');
    }

    // Render stars
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star${i <= rating ? ' active' : ''}"></i>`;
        }
        return stars;
    }

    // Update stats display
    updateStats() {
        const avgElement = document.getElementById('avgRating');
        const countElement = document.getElementById('reviewCount');
        
        if (avgElement) {
            avgElement.textContent = this.getAverageRating();
        }
        
        if (countElement) {
            countElement.textContent = this.reviews.length;
        }
        
        // Update review count text with proper pluralization
        this.updateReviewCountText();
    }
    
    // Update review count text with proper pluralization
    updateReviewCountText() {
        const reviewCountElement = document.querySelector('.review-count');
        if (reviewCountElement && typeof t === 'function') {
            const count = this.reviews.length;
            let text;
            if (count === 0) {
                text = t('reviewsCount');
            } else if (count === 1) {
                text = t('reviewsCountOne');
            } else if (count >= 2 && count <= 4) {
                text = t('reviewCount');
            } else {
                text = t('reviewsCount');
            }
            reviewCountElement.innerHTML = `(<span id="reviewCount">${count}</span> ${text})`;
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize review system when page loads
let reviewSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Get apartment slug from data attribute
    const reviewsContainer = document.getElementById('reviewsSection');
    if (reviewsContainer) {
        const apartmentSlug = reviewsContainer.getAttribute('data-apartment');
        reviewSystem = new ReviewsSystem(apartmentSlug);
        reviewSystem.renderReviews();
        reviewSystem.updateStats();
    }

    // Handle review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value.trim();
            const rating = document.querySelector('input[name="rating"]:checked');
            const text = document.getElementById('reviewText').value.trim();

            // Validation
            if (!name || !rating || !text) {
                alert(typeof t === 'function' ? t('fillAllFields') : 'Пожалуйста, заполните все поля');
                return;
            }

            if (text.length < 10) {
                alert(typeof t === 'function' ? t('reviewMinLength') : 'Отзыв должен содержать минимум 10 символов');
                return;
            }

            // Add review
            reviewSystem.addReview(name, rating.value, text);
            reviewSystem.renderReviews();
            reviewSystem.updateStats();

            // Reset form
            reviewForm.reset();
            
            // Remove active class from stars
            document.querySelectorAll('.rating-stars label').forEach(label => {
                label.classList.remove('active');
            });

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = typeof t === 'function' ? t('thankYouReview') : 'Спасибо за ваш отзыв!';
            reviewForm.insertAdjacentElement('beforebegin', successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);

            // Scroll to reviews list
            document.getElementById('reviewsList').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Star rating interactivity
    const ratingInputs = document.querySelectorAll('.rating-stars input[type="radio"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            const stars = document.querySelectorAll('.rating-stars label');
            const value = parseInt(this.value);
            
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        });
    });
});