// E-DROP AI Recommendations Engine
class AIRecommendations {
    constructor() {
        this.userBehavior = {
            viewedServices: [],
            searchedTerms: [],
            clickedElements: [],
            timeSpent: {},
            scrollDepth: 0
        };

        this.services = [
            {
                id: 'ecab',
                name: 'E-CAB',
                category: 'transportation',
                features: ['GPS Tracking', 'Professional Drivers', '24/7 Service'],
                targetAudience: ['business travelers', 'individuals', 'corporate clients'],
                keywords: ['taxi', 'cab', 'transport', 'ride', 'passenger']
            },
            {
                id: 'eshipping',
                name: 'E-Shipping',
                category: 'shipping',
                features: ['Fast Delivery', 'Package Insurance', 'Real-time Tracking'],
                targetAudience: ['e-commerce sellers', 'individuals', 'small businesses'],
                keywords: ['shipping', 'delivery', 'package', 'parcel', 'courier']
            },
            {
                id: 'ecargo',
                name: 'E-Cargo',
                category: 'logistics',
                features: ['Heavy Freight', 'Customs Clearance', 'Project Cargo'],
                targetAudience: ['industries', 'construction', 'manufacturing', 'large businesses'],
                keywords: ['cargo', 'freight', 'heavy', 'industrial', 'logistics']
            },
            {
                id: 'warehousing',
                name: 'Warehousing',
                category: 'storage',
                features: ['Climate Control', '24/7 Security', 'Inventory Management'],
                targetAudience: ['e-commerce', 'manufacturers', 'distributors'],
                keywords: ['warehouse', 'storage', 'depot', 'inventory', 'stock']
            },
            {
                id: 'express',
                name: 'Express Delivery',
                category: 'urgent',
                features: ['Same-day Delivery', 'Priority Handling', 'Live Updates'],
                targetAudience: ['urgent needs', 'time-sensitive', 'emergency'],
                keywords: ['express', 'urgent', 'fast', 'same-day', 'emergency']
            }
        ];

        this.recommendationRules = {
            scrollDepth: {
                low: (depth) => depth < 25,
                medium: (depth) => depth >= 25 && depth < 75,
                high: (depth) => depth >= 75
            },
            timeSpent: {
                quick: (time) => time < 30,
                normal: (time) => time >= 30 && time < 120,
                engaged: (time) => time >= 120
            },
            searchIntent: {
                transportation: ['taxi', 'cab', 'ride', 'transport', 'passenger', 'travel'],
                shipping: ['shipping', 'delivery', 'package', 'parcel', 'courier', 'mail'],
                logistics: ['cargo', 'freight', 'warehouse', 'storage', 'logistics', 'supply'],
                urgent: ['express', 'urgent', 'fast', 'same-day', 'emergency', 'quick']
            }
        };
    }

    init() {
        this.trackUserBehavior();
        this.createRecommendationUI();
        this.showInitialRecommendations();
    }

    trackUserBehavior() {
        // Track service views
        document.querySelectorAll('[data-service]').forEach(element => {
            element.addEventListener('click', (e) => {
                const serviceId = e.currentTarget.dataset.service;
                this.userBehavior.viewedServices.push(serviceId);
                this.updateRecommendations();
            });
        });

        // Track search terms
        const searchInput = document.getElementById('ai-search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        this.userBehavior.searchedTerms.push(e.target.value);
                        this.updateRecommendations();
                    }
                }, 1000);
            });
        }

        // Track scroll depth
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            this.userBehavior.scrollDepth = Math.max(this.userBehavior.scrollDepth, scrollPercent);
        });

        // Track time spent
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            this.userBehavior.timeSpent.total = timeSpent;
        });

        // Track section visibility
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        this.userBehavior.timeSpent[sectionId] = (this.userBehavior.timeSpent[sectionId] || 0) + 1;
                    }
                }
            });
        }, observerOptions);

        // Observe all major sections
        document.querySelectorAll('section[id], div[id]').forEach(section => {
            observer.observe(section);
        });
    }

    createRecommendationUI() {
        const recommendationHTML = `
            <div id="ai-recommendations" class="ai-recommendations">
                <div class="recommendation-header">
                    <div class="rec-avatar">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="rec-info">
                        <h4>AI Recommendations</h4>
                        <p>Personalized suggestions based on your interests</p>
                    </div>
                    <button id="toggle-recommendations" class="toggle-btn">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>

                <div id="recommendations-content" class="recommendations-content">
                    <div id="recommendations-list" class="recommendations-list">
                        <!-- Recommendations will be populated here -->
                    </div>

                    <div class="recommendation-actions">
                        <button id="refresh-recommendations" class="action-btn refresh-btn">
                            <i class="fas fa-sync-alt"></i> Refresh Suggestions
                        </button>
                        <button id="dismiss-recommendations" class="action-btn dismiss-btn">
                            <i class="fas fa-times"></i> Hide for Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', recommendationHTML);
        this.addStyles();
        this.bindRecommendationEvents();
    }

    addStyles() {
        const styles = `
            <style>
                .ai-recommendations {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    width: 350px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    z-index: 999;
                    font-family: 'Arial', sans-serif;
                    overflow: hidden;
                    transform: translateY(100px);
                    opacity: 0;
                    transition: all 0.4s ease;
                }

                .ai-recommendations.visible {
                    transform: translateY(0);
                    opacity: 1;
                }

                .recommendation-header {
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .rec-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                }

                .rec-info h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .rec-info p {
                    margin: 5px 0 0 0;
                    font-size: 12px;
                    opacity: 0.9;
                }

                .toggle-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    transition: background 0.3s;
                }

                .toggle-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .recommendations-content {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .recommendations-list {
                    padding: 0;
                }

                .recommendation-item {
                    padding: 15px 20px;
                    border-bottom: 1px solid #f8f9fa;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: flex-start;
                }

                .recommendation-item:hover {
                    background: #f8f9fa;
                    transform: translateX(5px);
                }

                .rec-item-icon {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .rec-transportation { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; }
                .rec-shipping { background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; }
                .rec-logistics { background: linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%); color: white; }
                .rec-storage { background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); color: white; }
                .rec-urgent { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; }

                .rec-item-content h5 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #495057;
                }

                .rec-item-content p {
                    margin: 0;
                    font-size: 12px;
                    color: #6c757d;
                    line-height: 1.4;
                }

                .rec-confidence {
                    margin-top: 8px;
                    font-size: 11px;
                    color: #28a745;
                    font-weight: 500;
                }

                .recommendation-actions {
                    padding: 15px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    gap: 10px;
                }

                .action-btn {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #dee2e6;
                    background: white;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    transition: all 0.3s;
                }

                .refresh-btn:hover {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }

                .dismiss-btn:hover {
                    background: #dc3545;
                    color: white;
                    border-color: #dc3545;
                }

                .rec-badge {
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-left: auto;
                    flex-shrink: 0;
                }

                @media (max-width: 480px) {
                    .ai-recommendations {
                        width: calc(100vw - 40px);
                        right: 20px;
                        bottom: 120px;
                    }

                    .recommendation-header {
                        padding: 12px 15px;
                    }

                    .recommendation-item {
                        padding: 12px 15px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindRecommendationEvents() {
        const toggleBtn = document.getElementById('toggle-recommendations');
        const refreshBtn = document.getElementById('refresh-recommendations');
        const dismissBtn = document.getElementById('dismiss-recommendations');

        toggleBtn.addEventListener('click', () => {
            const content = document.getElementById('recommendations-content');
            const icon = toggleBtn.querySelector('i');

            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            } else {
                content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            }
        });

        refreshBtn.addEventListener('click', () => {
            this.updateRecommendations();
            this.showRefreshAnimation();
        });

        dismissBtn.addEventListener('click', () => {
            document.getElementById('ai-recommendations').style.display = 'none';
            // Store dismissal in localStorage to not show again for some time
            localStorage.setItem('recommendationsDismissed', Date.now());
        });
    }

    showInitialRecommendations() {
        // Check if recommendations were recently dismissed
        const dismissedTime = localStorage.getItem('recommendationsDismissed');
        if (dismissedTime) {
            const hoursSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
            if (hoursSinceDismissal < 24) { // Don't show for 24 hours
                return;
            }
        }

        // Show recommendations after 10 seconds
        setTimeout(() => {
            this.updateRecommendations();
            this.showRecommendations();
        }, 10000);
    }

    updateRecommendations() {
        const recommendations = this.generateRecommendations();
        this.displayRecommendations(recommendations);
    }

    generateRecommendations() {
        const recommendations = [];
        const userProfile = this.analyzeUserProfile();

        // Rule-based recommendations
        if (userProfile.intent === 'transportation' || userProfile.intent === 'unknown') {
            recommendations.push({
                service: this.services.find(s => s.id === 'ecab'),
                reason: 'Most popular transportation service',
                confidence: 'High'
            });
        }

        if (userProfile.intent === 'shipping' || userProfile.searchedShipping) {
            recommendations.push({
                service: this.services.find(s => s.id === 'eshipping'),
                reason: 'Based on your search for shipping services',
                confidence: 'High'
            });
        }

        if (userProfile.scrollDepth === 'high' && userProfile.timeSpent === 'engaged') {
            recommendations.push({
                service: this.services.find(s => s.id === 'ecargo'),
                reason: 'Advanced logistics solution for serious businesses',
                confidence: 'Medium'
            });
        }

        if (userProfile.viewedServices.includes('warehousing') || userProfile.searchedStorage) {
            recommendations.push({
                service: this.services.find(s => s.id === 'express'),
                reason: 'Perfect companion for your storage needs',
                confidence: 'Medium'
            });
        }

        // Default recommendations if no specific intent
        if (recommendations.length === 0) {
            recommendations.push(
                {
                    service: this.services.find(s => s.id === 'eshipping'),
                    reason: 'Most requested service by our customers',
                    confidence: 'Medium'
                },
                {
                    service: this.services.find(s => s.id === 'ecab'),
                    reason: 'Reliable transportation solution',
                    confidence: 'Low'
                }
            );
        }

        return recommendations.slice(0, 3); // Return top 3 recommendations
    }

    analyzeUserProfile() {
        const profile = {
            intent: 'unknown',
            scrollDepth: 'low',
            timeSpent: 'quick',
            searchedShipping: false,
            searchedStorage: false,
            viewedServices: this.userBehavior.viewedServices
        };

        // Analyze scroll depth
        if (this.recommendationRules.scrollDepth.high(this.userBehavior.scrollDepth)) {
            profile.scrollDepth = 'high';
        } else if (this.recommendationRules.scrollDepth.medium(this.userBehavior.scrollDepth)) {
            profile.scrollDepth = 'medium';
        }

        // Analyze time spent
        const totalTime = this.userBehavior.timeSpent.total || 0;
        if (this.recommendationRules.timeSpent.engaged(totalTime)) {
            profile.timeSpent = 'engaged';
        } else if (this.recommendationRules.timeSpent.normal(totalTime)) {
            profile.timeSpent = 'normal';
        }

        // Analyze search intent
        this.userBehavior.searchedTerms.forEach(term => {
            const lowerTerm = term.toLowerCase();

            if (this.recommendationRules.searchIntent.transportation.some(k => lowerTerm.includes(k))) {
                profile.intent = 'transportation';
            } else if (this.recommendationRules.searchIntent.shipping.some(k => lowerTerm.includes(k))) {
                profile.intent = 'shipping';
                profile.searchedShipping = true;
            } else if (this.recommendationRules.searchIntent.logistics.some(k => lowerTerm.includes(k))) {
                profile.intent = 'logistics';
            } else if (this.recommendationRules.searchIntent.urgent.some(k => lowerTerm.includes(k))) {
                profile.intent = 'urgent';
            }

            if (this.recommendationRules.searchIntent.shipping.some(k => lowerTerm.includes(k))) {
                profile.searchedShipping = true;
            }

            if (['warehouse', 'storage', 'depot'].some(k => lowerTerm.includes(k))) {
                profile.searchedStorage = true;
            }
        });

        return profile;
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-list');

        if (recommendations.length === 0) {
            container.innerHTML = `
                <div class="recommendation-item">
                    <div class="rec-item-content">
                        <h5>No recommendations available</h5>
                        <p>Browse our services to get personalized suggestions!</p>
                    </div>
                </div>
            `;
            return;
        }

        const html = recommendations.map(rec => {
            const confidenceColors = {
                'High': '#28a745',
                'Medium': '#ffc107',
                'Low': '#dc3545'
            };

            const categoryClasses = {
                transportation: 'rec-transportation',
                shipping: 'rec-shipping',
                logistics: 'rec-logistics',
                storage: 'rec-storage',
                urgent: 'rec-urgent'
            };

            return `
                <div class="recommendation-item" onclick="aiRecommendations.selectService('${rec.service.id}')">
                    <div class="rec-item-icon ${categoryClasses[rec.service.category] || 'rec-transportation'}">
                        <i class="fas fa-${rec.service.id === 'ecab' ? 'taxi' : rec.service.id === 'eshipping' ? 'truck' : rec.service.id === 'ecargo' ? 'boxes' : rec.service.id === 'warehousing' ? 'warehouse' : 'shipping-fast'}"></i>
                    </div>
                    <div class="rec-item-content">
                        <h5>${rec.service.name}</h5>
                        <p>${rec.reason}</p>
                        <div class="rec-confidence" style="color: ${confidenceColors[rec.confidence]}">
                            <i class="fas fa-star"></i> ${rec.confidence} Match
                        </div>
                    </div>
                    <span class="rec-badge">Recommended</span>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    selectService(serviceId) {
        // Scroll to service section
        const serviceElement = document.getElementById(serviceId) || document.querySelector(`[data-service="${serviceId}"]`);
        if (serviceElement) {
            serviceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add click tracking
            this.userBehavior.clickedElements.push(serviceId);
        }

        // Hide recommendations temporarily
        this.hideRecommendations();
    }

    showRecommendations() {
        const recElement = document.getElementById('ai-recommendations');
        recElement.classList.add('visible');
    }

    hideRecommendations() {
        const recElement = document.getElementById('ai-recommendations');
        recElement.classList.remove('visible');

        // Show again after 5 minutes
        setTimeout(() => {
            if (!localStorage.getItem('recommendationsDismissed')) {
                this.showRecommendations();
            }
        }, 5 * 60 * 1000);
    }

    showRefreshAnimation() {
        const refreshBtn = document.getElementById('refresh-recommendations');
        const icon = refreshBtn.querySelector('i');

        icon.style.animation = 'spin 1s linear';
        setTimeout(() => {
            icon.style.animation = '';
        }, 1000);
    }
}

// Add CSS animation for spin
const spinAnimation = `
    <style>
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
`;
document.head.insertAdjacentHTML('beforeend', spinAnimation);

// Initialize AI recommendations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiRecommendations = new AIRecommendations();
    window.aiRecommendations.init();
});
