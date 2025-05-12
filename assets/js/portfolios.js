// Configuration
const UNSPLASH_API_KEY = CONFIG.UNSPLASH_API_KEY;
const ITEMS_PER_PAGE = 6;
const PLACEHOLDER_IMAGE = 'assets/images/placeholders/portfolio-placeholder.svg';
const PLACEHOLDER_AVATAR = 'assets/images/placeholders/avatar-placeholder.svg';
const API_TIMEOUT = 10000; // 10 seconds timeout

// State management
let allPortfolios = [];
let currentPage = 1;
let currentCategory = 'All';
let searchQuery = '';

// DOM Elements
const cardGrid = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3.g-4');
const searchInput = document.getElementById('search-id');
const filterButtons = document.querySelectorAll('.btn-filter');

// Portfolio metadata for each category
const portfolioMetadata = {
    'Web Development': {
        query: 'web development coding computer',
        titles: ['Modern Web Framework', 'Full-Stack Application', 'Cloud-Native Platform'],
        descriptions: [
            'A responsive web application built with React and Node.js, featuring real-time data synchronization.',
            'Enterprise-grade application with microservices architecture and robust security features.',
            'Scalable cloud platform leveraging AWS services for high availability and performance.'
        ]
    },
    'Graphic Design': {
        query: 'graphic design art creative',
        titles: ['Brand Identity System', 'Print Media Collection', 'Digital Marketing Assets'],
        descriptions: [
            'Comprehensive brand identity including logo, typography, and visual guidelines.',
            'Collection of print materials showcasing versatile design approaches.',
            'Suite of digital marketing materials optimized for various platforms.'
        ]
    },
    'Data Science': {
        query: 'data visualization analytics dashboard',
        titles: ['Predictive Analytics Engine', 'Machine Learning Pipeline', 'Data Visualization Dashboard'],
        descriptions: [
            'Advanced predictive modeling system using cutting-edge machine learning algorithms.',
            'Automated data processing and model training pipeline with real-time monitoring.',
            'Interactive visualization platform presenting complex data insights in an accessible format.'
        ]
    },
    'Mobile Development': {
        query: 'mobile app interface smartphone',
        titles: ['Cross-Platform Mobile App', 'Native iOS Application', 'Android Gaming Platform'],
        descriptions: [
            'Cross-platform mobile application built with Flutter, delivering seamless user experience.',
            'Native iOS app with rich multimedia features and offline capabilities.',
            'High-performance Android gaming platform with real-time multiplayer support.'
        ]
    },
    'UX/UI Design': {
        query: 'user interface design ux',
        titles: ['E-commerce Platform Design', 'Mobile App Interface', 'Design System'],
        descriptions: [
            'Complete e-commerce platform redesign focusing on conversion optimization.',
            'Intuitive mobile app interface design with comprehensive user research.',
            'Scalable design system implementation for enterprise applications.'
        ]
    },
    'Cybersecurity': {
        query: 'security network protection',
        titles: ['Security Infrastructure', 'Threat Detection System', 'Compliance Framework'],
        descriptions: [
            'Enterprise security infrastructure with multi-layer protection strategies.',
            'AI-powered threat detection and response system with real-time monitoring.',
            'Comprehensive compliance framework meeting international security standards.'
        ]
    },
    'Digital Marketing': {
        query: 'digital marketing social media',
        titles: ['Marketing Campaign Suite', 'Social Media Strategy', 'Analytics Dashboard'],
        descriptions: [
            'Integrated marketing campaign across multiple digital channels.',
            'Data-driven social media strategy with measurable ROI metrics.',
            'Real-time marketing analytics dashboard for campaign optimization.'
        ]
    },
    '3D Design': {
        query: '3d modeling rendering design',
        titles: ['Architectural Visualization', '3D Product Modeling', 'Character Design'],
        descriptions: [
            'Photorealistic architectural visualization for commercial projects.',
            'Detailed 3D product models for manufacturing and marketing.',
            'Character design and animation for gaming and entertainment.'
        ]
    }
};

// Utility Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Main Functions
async function fetchUnsplashImages(query, count = 10) {
    try {
        console.log('Fetching images for query:', query);
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), API_TIMEOUT);
        });
        
        // Create fetch promise
        const fetchPromise = fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
                }
            }
        );
        
        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('No images found');
        }
        
        return data.results;
    } catch (error) {
        console.error(`Error fetching images for "${query}":`, error.message);
        // Return placeholder data immediately on error
        return Array(count).fill({
            urls: { regular: PLACEHOLDER_IMAGE },
            user: { name: 'Anonymous Artist', profile_image: { medium: PLACEHOLDER_AVATAR } }
        });
    }
}

function createPortfolioCard(portfolio) {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
        <article class="portfolio-card card h-100">
            <div class="card-img-container">
                <img src="${portfolio.imageUrl}" 
                     srcset="${portfolio.imageUrl}&w=400 400w, ${portfolio.imageUrl}&w=800 800w"
                     sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                     class="card-img-top" 
                     alt="${portfolio.title}"
                     width="800" height="600"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}'; this.srcset='';">
                <div class="verified-badge">
                    <i class="bi bi-patch-check-fill" aria-hidden="true"></i>
                    <span>Verified</span>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title h5">${portfolio.title}</h3>
                <div class="author-info">
                    <img src="${portfolio.authorImage}" 
                         alt="" 
                         class="author-img" 
                         width="40" height="40" 
                         loading="lazy" 
                         aria-hidden="true"
                         onerror="this.onerror=null; this.src='${PLACEHOLDER_AVATAR}';">
                    <span>${portfolio.author}</span>
                </div>
                <div class="portfolio-rating mb-2">
                    <div class="d-flex align-items-center">
                        <div class="rating me-2" role="img" aria-label="${portfolio.rating} out of 5 stars rating">
                            <span aria-hidden="true">${'★'.repeat(portfolio.rating)}${'☆'.repeat(5-portfolio.rating)}</span>
                        </div>
                        <span class="rating-count text-muted small">(${portfolio.reviews}k reviews)</span>
                    </div>
                </div>
                <p class="card-text">${portfolio.description}</p>
            </div>
            <div class="card-footer">
                <span class="category-tag">${portfolio.category}</span>
                <time class="verification-date" datetime="${portfolio.verificationDate}">
                    Verified on ${formatDate(new Date(portfolio.verificationDate))}
                </time>
            </div>
        </article>
    `;
    
    // Add error logging
    const images = card.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', (e) => {
            console.warn('Image failed to load:', e.target.src);
        });
    });
    
    return card;
}

function showLoadingState() {
    cardGrid.innerHTML = Array(ITEMS_PER_PAGE)
        .fill()
        .map(() => `
            <div class="col">
                <article class="portfolio-card card h-100 loading">
                    <div class="card-img-container skeleton"></div>
                    <div class="card-body">
                        <div class="card-title skeleton"></div>
                        <div class="author-info skeleton"></div>
                        <div class="portfolio-rating skeleton"></div>
                        <div class="card-text skeleton"></div>
                    </div>
                </article>
            </div>
        `)
        .join('');
}

function showNoResults() {
    cardGrid.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search fa-3x mb-3"></i>
            <h3>No Results Found</h3>
            <p>Try adjusting your search criteria or browse all categories.</p>
        </div>
    `;
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Remove existing pagination if any
    const existingPagination = document.querySelector('.pagination-container');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Create new pagination
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-btn';
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPortfolios();
        }
    });
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-btn';
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPortfolios();
        }
    });
    
    // Page numbers
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'd-flex gap-2';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPortfolios();
        });
        pageNumbers.appendChild(pageButton);
    }
    
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(nextButton);
    
    cardGrid.parentElement.appendChild(paginationContainer);
}

async function generatePortfolioData(category, images) {
    const metadata = portfolioMetadata[category] || portfolioMetadata['Web Development'];
    
    return images.map((image, index) => ({
        id: `portfolio-${category}-${index}`,
        title: metadata.titles[index % metadata.titles.length],
        author: image.user?.name || 'Anonymous Artist',
        authorImage: image.user?.profile_image?.medium || PLACEHOLDER_AVATAR,
        imageUrl: image.urls?.regular || PLACEHOLDER_IMAGE,
        description: metadata.descriptions[index % metadata.descriptions.length],
        category: category,
        rating: getRandomInt(4, 5),
        reviews: getRandomInt(1, 10),
        verificationDate: new Date(Date.now() - getRandomInt(0, 365) * 24 * 60 * 60 * 1000).toISOString()
    }));
}

async function initializePortfolios() {
    showLoadingState();
    let retryCount = 0;
    const MAX_RETRIES = 2;
    
    async function attemptInitialization() {
        try {
            const categories = Array.from(filterButtons)
                .map(btn => btn.textContent.trim())
                .filter(category => category !== 'All');
            
            // Fetch just one category first as a test
            const testCategory = categories[0];
            const testImages = await fetchUnsplashImages(portfolioMetadata[testCategory]?.query || testCategory, 1);
            
            if (testImages.length > 0) {
                // If test succeeds, fetch all categories
                const imagePromises = categories.map(category => 
                    fetchUnsplashImages(portfolioMetadata[category]?.query || category, 10)
                );
                
                const allImages = await Promise.all(imagePromises);
                allPortfolios = [];
                
                for (let i = 0; i < categories.length; i++) {
                    const portfolios = await generatePortfolioData(categories[i], allImages[i]);
                    allPortfolios = [...allPortfolios, ...portfolios];
                }
                
                renderPortfolios();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Initialization attempt failed:', error);
            return false;
        }
    }
    
    // Try initialization with retries
    while (retryCount < MAX_RETRIES) {
        const success = await attemptInitialization();
        if (success) return;
        retryCount++;
        if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
    }
    
    // If all retries fail, show error and fall back to placeholder data
    console.error('Failed to initialize after', MAX_RETRIES, 'attempts');
    allPortfolios = generateFallbackData();
    renderPortfolios();
}

// Add this helper function for fallback data
function generateFallbackData() {
    const categories = Array.from(filterButtons)
        .map(btn => btn.textContent.trim())
        .filter(category => category !== 'All');
    
    return categories.flatMap(category => {
        const metadata = portfolioMetadata[category];
        return metadata.titles.map((title, index) => ({
            id: `portfolio-${category}-${index}`,
            title: title,
            author: 'Sample Author',
            authorImage: PLACEHOLDER_AVATAR,
            imageUrl: PLACEHOLDER_IMAGE,
            description: metadata.descriptions[index],
            category: category,
            rating: getRandomInt(4, 5),
            reviews: getRandomInt(1, 10),
            verificationDate: new Date(Date.now() - getRandomInt(0, 365) * 24 * 60 * 60 * 1000).toISOString()
        }));
    });
}

function filterPortfolios() {
    let filtered = [...allPortfolios];
    
    // Apply category filter
    if (currentCategory !== 'All') {
        filtered = filtered.filter(portfolio => portfolio.category === currentCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(portfolio => 
            portfolio.title.toLowerCase().includes(query) ||
            portfolio.author.toLowerCase().includes(query) ||
            portfolio.description.toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

function renderPortfolios() {
    const filtered = filterPortfolios();
    
    if (filtered.length === 0) {
        showNoResults();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const portfoliosToShow = filtered.slice(startIndex, endIndex);
    
    // Clear existing content
    cardGrid.innerHTML = '';
    
    // Render portfolio cards
    portfoliosToShow.forEach(portfolio => {
        cardGrid.appendChild(createPortfolioCard(portfolio));
    });
    
    // Update pagination
    updatePagination(filtered.length);
}

// Event Listeners
searchInput.addEventListener('input', debounce(function(e) {
    searchQuery = e.target.value;
    currentPage = 1;
    renderPortfolios();
}, 300));

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.textContent;
        currentPage = 1;
        renderPortfolios();
    });
});

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePortfolios);