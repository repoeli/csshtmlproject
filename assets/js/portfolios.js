// Configuration
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
        query: 'graphic design creative artwork',
        titles: ['Brand Identity System', 'Print Media Collection', 'Digital Marketing Assets'],
        descriptions: [
            'Comprehensive brand identity including logo design, color palettes, and brand guidelines.',
            'Collection of print materials including brochures, business cards, and promotional materials.',
            'Digital marketing assets optimized for social media and online advertising campaigns.'
        ]
    },
    'Data Science': {
        query: 'data science analytics visualization',
        titles: ['Predictive Analytics Engine', 'Machine Learning Pipeline', 'Data Visualization Dashboard'],
        descriptions: [
            'Advanced predictive analytics system using machine learning algorithms for business intelligence.',
            'Automated machine learning pipeline for data processing and model deployment.',
            'Interactive data visualization dashboard for real-time business metrics and KPIs.'
        ]
    },
    'Mobile Development': {
        query: 'mobile app development smartphone',
        titles: ['Cross-Platform Mobile App', 'Native iOS Application', 'Android Gaming Platform'],
        descriptions: [
            'Cross-platform mobile application built with Flutter for iOS and Android devices.',
            'Native iOS application with seamless integration to Apple ecosystem services.',
            'Android gaming platform with multiplayer capabilities and social features.'
        ]
    },
    'UX/UI Design': {
        query: 'user interface ux ui design',
        titles: ['E-commerce Platform Design', 'Mobile App Interface', 'Design System'],
        descriptions: [
            'Complete e-commerce platform design with user-centered design principles and conversion optimization.',
            'Mobile app interface design focusing on user experience and accessibility standards.',
            'Comprehensive design system with reusable components and design guidelines.'
        ]
    },
    'Cybersecurity': {
        query: 'cybersecurity security network protection',
        titles: ['Security Infrastructure', 'Threat Detection System', 'Compliance Framework'],
        descriptions: [
            'Enterprise security infrastructure with multi-layered protection and monitoring systems.',
            'Advanced threat detection system using AI and machine learning for real-time security monitoring.',
            'Comprehensive compliance framework meeting industry standards and regulatory requirements.'
        ]
    },
    'Digital Marketing': {
        query: 'digital marketing social media campaign',
        titles: ['Marketing Campaign Suite', 'Social Media Strategy', 'Analytics Dashboard'],
        descriptions: [
            'Integrated digital marketing campaign with multi-channel approach and performance tracking.',
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

// Enhanced keyword extraction for better image-to-content matching
function extractRelevantKeywords(title, category) {
    // Common stopwords to filter out
    const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'by', 'at', 'to', 'in', 'on', 'of', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall']);
    
    // Enhanced keyword mappings with more specific terms for better image matching
    const enhancedKeywordMappings = {
        'Web Development': {
            'Modern Web Framework': ['react', 'javascript', 'framework', 'frontend', 'coding', 'development'],
            'Full-Stack Application': ['fullstack', 'backend', 'database', 'server', 'application', 'development'],
            'Cloud-Native Platform': ['cloud', 'aws', 'platform', 'infrastructure', 'devops', 'server']
        },
        'Graphic Design': {
            'Brand Identity System': ['branding', 'logo', 'identity', 'typography', 'corporate', 'design'],
            'Print Media Collection': ['print', 'poster', 'brochure', 'magazine', 'publication', 'media'],
            'Digital Marketing Assets': ['banner', 'advertisement', 'social media', 'marketing', 'graphics', 'digital']
        },
        'Data Science': {
            'Predictive Analytics Engine': ['analytics', 'prediction', 'machine learning', 'algorithm', 'data', 'charts'],
            'Machine Learning Pipeline': ['artificial intelligence', 'neural network', 'automation', 'pipeline', 'algorithm'],
            'Data Visualization Dashboard': ['dashboard', 'charts', 'graphs', 'visualization', 'metrics', 'analytics']
        },
        'Mobile Development': {
            'Cross-Platform Mobile App': ['mobile', 'flutter', 'cross platform', 'smartphone', 'app', 'interface'],
            'Native iOS Application': ['ios', 'iphone', 'apple', 'native', 'mobile', 'application'],
            'Android Gaming Platform': ['android', 'gaming', 'game', 'mobile', 'platform', 'entertainment']
        },
        'UX/UI Design': {
            'E-commerce Platform Design': ['ecommerce', 'shopping', 'website', 'user interface', 'ux', 'design'],
            'Mobile App Interface': ['mobile interface', 'app design', 'ui', 'user experience', 'prototype'],
            'Design System': ['design system', 'components', 'ui kit', 'interface', 'guidelines', 'design']
        },
        'Cybersecurity': {
            'Security Infrastructure': ['cybersecurity', 'network', 'firewall', 'security', 'infrastructure', 'protection'],
            'Threat Detection System': ['threat', 'detection', 'monitoring', 'security', 'cyber', 'analysis'],
            'Compliance Framework': ['compliance', 'framework', 'standards', 'security', 'audit', 'certification']
        },
        'Digital Marketing': {
            'Marketing Campaign Suite': ['campaign', 'marketing', 'strategy', 'advertising', 'promotion', 'digital'],
            'Social Media Strategy': ['social media', 'instagram', 'facebook', 'strategy', 'engagement', 'content'],
            'Analytics Dashboard': ['analytics', 'metrics', 'dashboard', 'reporting', 'data', 'insights']
        },
        '3D Design': {
            'Architectural Visualization': ['architecture', 'building', 'visualization', '3d rendering', 'construction'],
            '3D Product Modeling': ['3d model', 'product', 'modeling', 'rendering', 'design', 'visualization'],
            'Character Design': ['character', 'animation', '3d character', 'game', 'modeling', 'entertainment']
        }
    };
    
    // Get title-specific keywords if available
    const titleSpecificKeywords = enhancedKeywordMappings[category]?.[title] || [];
    
    // Extract meaningful words from title
    const titleWords = title.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .split(' ')
        .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Combine title-specific keywords with title words
    const relevantKeywords = [...titleSpecificKeywords, ...titleWords];
    
    // Remove duplicates and limit to best keywords
    const uniqueKeywords = [...new Set(relevantKeywords)];
    
    return uniqueKeywords.slice(0, 4).join(' ');
}

// Main Functions
async function fetchUnsplashImages(query, count = 10) {
    try {
        console.log('🔍 Fetching images for query:', query);
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), API_TIMEOUT);
        });
        
        // Create fetch promise using Heroku proxy
        const proxyUrl = `${apiConfig.unsplash.endpoint}?query=${encodeURIComponent(query)}&per_page=${count}`;
        console.log('📡 Making request to proxy:', proxyUrl);
        
        const fetchPromise = fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        console.log('📊 Proxy response status:', response.status);
        console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            throw new Error(`Failed to fetch images from proxy: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Proxy response data preview:', {
            total: data.total,
            total_pages: data.total_pages,
            results_count: data.results ? data.results.length : 0,
            first_result: data.results && data.results[0] ? {
                id: data.results[0].id,
                urls: data.results[0].urls ? Object.keys(data.results[0].urls) : null,
                user: data.results[0].user ? data.results[0].user.name : null
            } : null
        });
        
        if (!data.results || data.results.length === 0) {
            console.warn('⚠️ No images found in proxy response');
            throw new Error('No images found in proxy response');
        }
        
        console.log(`✅ Successfully fetched ${data.results.length} images from proxy for query: "${query}"`);
        return data.results;
    } catch (error) {
        console.error(`❌ Error fetching images for "${query}":`, error.message);
        console.log('🔄 Falling back to placeholder images');
        return Array(count).fill({
            urls: { regular: PLACEHOLDER_IMAGE },
            user: { name: 'Anonymous Artist', profile_image: { medium: PLACEHOLDER_AVATAR } }
        });
    }
}

function createPortfolioCard(portfolio) {
    const card = document.createElement('div');
    card.className = 'col';
    
    // Ensure we have valid URLs for srcset
    const imageUrl = portfolio.imageUrl !== PLACEHOLDER_IMAGE ? portfolio.imageUrl : PLACEHOLDER_IMAGE;
    const srcsetAttr = imageUrl !== PLACEHOLDER_IMAGE ? 
        `srcset="${imageUrl}&w=400 400w, ${imageUrl}&w=800 800w"` : 
        '';
    
    card.innerHTML = `
        <article class="portfolio-card card h-100" data-category="${portfolio.category}" data-title="${portfolio.title}">
            <div class="card-img-container">
                <img src="${imageUrl}" 
                     ${srcsetAttr}
                     sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                     class="card-img-top" 
                     alt="${portfolio.title} portfolio showcase"
                     width="800" height="600"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}'; this.removeAttribute('srcset');">
                <div class="verified-badge" role="img" aria-label="Verified portfolio">
                    <i class="bi bi-patch-check-fill" aria-hidden="true"></i>
                    <span>Verified</span>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title h5" title="${portfolio.title}">${portfolio.title}</h3>
                <div class="author-info">
                    <img src="${portfolio.authorImage}" 
                         alt="${portfolio.author} profile picture" 
                         class="author-img" 
                         width="40" height="40" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='${PLACEHOLDER_AVATAR}';">
                    <span title="Portfolio author">${portfolio.author}</span>
                </div>
                <div class="portfolio-rating mb-2">
                    <div class="d-flex align-items-center">
                        <div class="rating me-2" role="img" aria-label="${portfolio.rating} out of 5 stars rating">
                            <span aria-hidden="true">${'★'.repeat(portfolio.rating)}${'☆'.repeat(5-portfolio.rating)}</span>
                        </div>
                        <span class="rating-count text-muted small">(${portfolio.reviews}k reviews)</span>
                    </div>
                </div>
                <p class="card-text" title="${portfolio.description}">${portfolio.description}</p>
            </div>
            <div class="card-footer">
                <span class="category-tag" title="Category: ${portfolio.category}">${portfolio.category}</span>
                <time class="verification-date" datetime="${portfolio.verificationDate}" title="Verification date">
                    Verified on ${formatDate(new Date(portfolio.verificationDate))}
                </time>
            </div>
        </article>
    `;
    
    // Enhanced error logging and image handling
    const images = card.querySelectorAll('img');
    images.forEach((img, index) => {
        img.addEventListener('error', (e) => {
            console.warn(`Image ${index === 0 ? 'main' : 'avatar'} failed to load for portfolio "${portfolio.title}":`, e.target.src);
        });
        
        img.addEventListener('load', (e) => {
            console.log(`✅ Image ${index === 0 ? 'main' : 'avatar'} loaded successfully for "${portfolio.title}"`);
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

// Helper function to create page buttons
function createPageButton(pageNum, totalPages) {
    const pageButton = document.createElement('button');
    pageButton.className = `pagination-btn btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
    pageButton.textContent = pageNum;
    pageButton.style.cssText = 'min-width: 40px; height: 40px; font-size: 14px;';
    pageButton.addEventListener('click', () => {
        currentPage = pageNum;
        renderPortfolios();
    });
    return pageButton;
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Remove existing pagination if any
    const existingPagination = document.querySelector('.pagination-container');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Don't show pagination if only one page
    if (totalPages <= 1) return;
    
    // Create new pagination with compact design
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container d-flex justify-content-center align-items-center mt-4 mb-4';
    paginationContainer.style.cssText = `
        gap: 8px;
        flex-wrap: wrap;
        max-width: 100%;
        overflow: hidden;
    `;
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-btn btn btn-outline-primary btn-sm';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.style.cssText = 'min-width: 40px; height: 40px;';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPortfolios();
        }
    });
      // Page info display
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info mx-2 small';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pageInfo.style.cssText = 'white-space: nowrap; font-weight: 500;';
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-btn btn btn-outline-primary btn-sm';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.style.cssText = 'min-width: 40px; height: 40px;';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPortfolios();
        }
    });
    
    // Smart page number buttons (show limited set to prevent overflow)
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'd-flex gap-1 mx-2';
    pageNumbers.style.cssText = 'flex-wrap: nowrap; overflow: hidden;';
    
    // Calculate which page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Ensure we show at least 5 pages if possible
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
        const firstPageBtn = createPageButton(1, totalPages);
        pageNumbers.appendChild(firstPageBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'px-2 text-muted small align-self-end';
            ellipsis.style.cssText = 'line-height: 40px;';
            pageNumbers.appendChild(ellipsis);
        }
    }
    
    // Add page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPageButton(i, totalPages);
        pageNumbers.appendChild(pageButton);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'px-2 text-muted small align-self-end';
            ellipsis.style.cssText = 'line-height: 40px;';
            pageNumbers.appendChild(ellipsis);
        }
        
        const lastPageBtn = createPageButton(totalPages, totalPages);
        pageNumbers.appendChild(lastPageBtn);
    }
    
    // Assemble pagination
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextButton);
    
    cardGrid.parentElement.appendChild(paginationContainer);
}

async function initializePortfolios() {
    console.log('🚀 Initializing portfolios with Heroku proxy...');
    console.log('📡 Proxy endpoint:', apiConfig.unsplash.endpoint);
    
    showLoadingState();
    
    let retryCount = 0;
    const MAX_RETRIES = 2;
    
    async function attemptInitialization() {
        try {
            const categories = Array.from(filterButtons)
                .map(btn => btn.textContent.trim())
                .filter(category => category !== 'All');
            
            console.log('📂 Categories found:', categories);
            
            // Test the proxy with a simple query first
            console.log('🧪 Testing proxy connectivity...');
            const testImages = await fetchUnsplashImages('technology', 1);
            
            if (testImages.length > 0 && testImages[0].urls && testImages[0].urls.regular !== PLACEHOLDER_IMAGE) {
                console.log('✅ Proxy test successful! Images are being fetched correctly.');
                console.log('📸 Sample image URL:', testImages[0].urls.regular);
                
                // Fetch images for all categories using title-based keywords
                console.log('🔄 Fetching images for all categories using title-specific keywords...');
                
                allPortfolios = [];
                
                for (const category of categories) {
                    const metadata = portfolioMetadata[category];
                    if (!metadata) continue;
                    
                    console.log(`🎯 Processing category: "${category}"`);
                    
                    // Fetch images for each title in the category (3 images per title)
                    const imagesPerTitle = 3;
                    const titlePromises = metadata.titles.map(async (title, titleIndex) => {
                        // Enhanced keyword extraction with description context
                        const titleKeywords = extractRelevantKeywords(title, category);
                        const description = metadata.descriptions[titleIndex];
                        
                        // Extract additional keywords from description
                        const descriptionKeywords = description.toLowerCase()
                            .replace(/[^\w\s]/g, '')
                            .split(' ')
                            .filter(word => word.length > 3)
                            .filter(word => !['with', 'that', 'this', 'using', 'built', 'featuring', 'including'].includes(word))
                            .slice(0, 2)
                            .join(' ');
                        
                        const searchQuery = `${titleKeywords} ${descriptionKeywords}`.trim();
                        
                        console.log(`  📋 Title "${title}" using enhanced query: "${searchQuery}"`);
                        console.log(`  🔍 Extracted keywords: "${titleKeywords}"`);
                        console.log(`  📄 Description keywords: "${descriptionKeywords}"`);
                        
                        const titleImages = await fetchUnsplashImages(searchQuery, imagesPerTitle);
                        
                        // Generate portfolio items for this title
                        return titleImages.map((image, imageIndex) => {
                            const portfolio = {
                                id: `portfolio-${category}-${titleIndex}-${imageIndex}`,
                                title: title,
                                author: image.user?.name || 'Professional Designer',
                                authorImage: image.user?.profile_image?.medium || PLACEHOLDER_AVATAR,
                                imageUrl: image.urls?.regular || PLACEHOLDER_IMAGE,
                                description: metadata.descriptions[titleIndex],
                                category: category,
                                rating: getRandomInt(4, 5),
                                reviews: getRandomInt(5, 25),
                                verificationDate: new Date(Date.now() - getRandomInt(30, 365) * 24 * 60 * 60 * 1000).toISOString()
                            };
                            
                            console.log(`    ✨ Created portfolio: "${title}" with image from ${image.user?.name || 'Unknown'}`);
                            return portfolio;
                        });
                    });
                    
                    const categoryPortfolios = await Promise.all(titlePromises);
                    // Flatten the arrays and add to all portfolios
                    allPortfolios = [...allPortfolios, ...categoryPortfolios.flat()];
                    
                    console.log(`  ✅ Added ${categoryPortfolios.flat().length} portfolios for "${category}"`);
                }
                
                console.log(`🎉 Successfully loaded ${allPortfolios.length} portfolios from Unsplash via proxy`);
                console.log(`📊 Portfolio distribution by category:`, 
                    categories.reduce((acc, cat) => {
                        acc[cat] = allPortfolios.filter(p => p.category === cat).length;
                        return acc;
                    }, {})
                );
                
                // Log keyword effectiveness
                console.log(`🎯 Keyword matching summary:`);
                categories.forEach(category => {
                    const categoryPortfolios = allPortfolios.filter(p => p.category === category);
                    const metadata = portfolioMetadata[category];
                    if (metadata) {
                        console.log(`  📋 ${category}: ${categoryPortfolios.length} portfolios across ${metadata.titles.length} titles`);
                        metadata.titles.forEach((title, idx) => {
                            const titlePortfolios = categoryPortfolios.filter(p => p.title === title);
                            console.log(`    - "${title}": ${titlePortfolios.length} variations`);
                        });
                    }
                });
                
                renderPortfolios();
                return true;
            } else {
                console.warn('⚠️ Proxy test failed - no valid images received');
                return false;
            }
        } catch (error) {
            console.error('💥 Initialization attempt failed:', error);
            return false;
        }
    }
    
    // Try initialization with retries
    while (retryCount < MAX_RETRIES) {
        const success = await attemptInitialization();
        if (success) return;
        
        retryCount++;
        console.log(`🔄 Retry ${retryCount}/${MAX_RETRIES} in ${1000 * retryCount}ms...`);
        if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
    }
    
    // If all retries fail, show error and fall back to placeholder data
    console.error(`❌ Failed to initialize after ${MAX_RETRIES} attempts - falling back to local placeholders`);
    allPortfolios = generateFallbackData();
    renderPortfolios();
}

// Helper function for fallback data
function generateFallbackData() {
    const categories = Array.from(filterButtons)
        .map(btn => btn.textContent.trim())
        .filter(category => category !== 'All');
    
    const authorNames = [
        'Alex Johnson', 'Sarah Mitchell', 'David Chen', 'Emily Rodriguez', 'Michael Kim',
        'Jessica Taylor', 'Ryan Foster', 'Amanda Lee', 'Christopher Davis', 'Nicole Brown'
    ];
    
    return categories.flatMap(category => {
        const metadata = portfolioMetadata[category];
        if (!metadata) return [];
        
        console.log(`🔄 Generating fallback data for "${category}"`);
        
        return metadata.titles.flatMap((title, titleIndex) => {
            return Array(3).fill().map((_, portfolioIndex) => {
                const authorIndex = (titleIndex * 3 + portfolioIndex) % authorNames.length;
                return {
                    id: `portfolio-${category}-${titleIndex}-${portfolioIndex}`,
                    title: title,
                    author: authorNames[authorIndex],
                    authorImage: PLACEHOLDER_AVATAR,
                    imageUrl: PLACEHOLDER_IMAGE,
                    description: metadata.descriptions[titleIndex],
                    category: category,
                    rating: getRandomInt(4, 5),
                    reviews: getRandomInt(5, 25),
                    verificationDate: new Date(Date.now() - getRandomInt(30, 365) * 24 * 60 * 60 * 1000).toISOString()
                };
            });
        });
    });
}

function filterPortfolios() {
    let filtered = [...allPortfolios];
    
    // Apply category filter
    if (currentCategory !== 'All') {
        filtered = filtered.filter(portfolio => portfolio.category === currentCategory);
    }
    
    // Apply search filter with enhanced matching
    if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(portfolio => {
            // Search in title (highest priority)
            const titleMatch = portfolio.title.toLowerCase().includes(query);
            // Search in author name
            const authorMatch = portfolio.author.toLowerCase().includes(query);
            // Search in description
            const descriptionMatch = portfolio.description.toLowerCase().includes(query);
            // Search in category
            const categoryMatch = portfolio.category.toLowerCase().includes(query);
            
            // Individual word matching for better results
            const queryWords = query.split(' ').filter(word => word.length > 1);
            const wordMatch = queryWords.some(word => 
                portfolio.title.toLowerCase().includes(word) ||
                portfolio.description.toLowerCase().includes(word) ||
                portfolio.category.toLowerCase().includes(word)
            );
            
            return titleMatch || authorMatch || descriptionMatch || categoryMatch || wordMatch;
        });
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM Content Loaded - Portfolio page initializing...');
    console.log('⚙️ Using proxy configuration:', apiConfig);
    initializePortfolios();
});