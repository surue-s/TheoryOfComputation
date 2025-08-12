// Main JavaScript file for Theory of Computation website

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modeToggle = document.getElementById('mode-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const chapterCards = document.querySelectorAll('.chapter-card');
    const pathSteps = document.querySelectorAll('.path-step');
    const searchBar = document.getElementById('search-bar');
    const visualizationPanel = document.querySelector('.visualization-panel');
    const navLinks = document.querySelectorAll('nav a');
    const animateBtn = document.getElementById('animate-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    const visualizationPlaceholder = document.getElementById('visualization-placeholder');
    
    // Current mode (Academic by default)
    let currentMode = 'academic';
    let currentTheme = 'light';
    let visualizer = null;
    
    // Initialize 3D visualizer if container exists
    const visualizationContainer = document.getElementById('visualization-container');
    if (visualizationContainer) {
        // Wait a bit for Three.js to load
        setTimeout(() => {
            if (typeof TOCVisualizer !== 'undefined') {
                visualizer = new TOCVisualizer(visualizationContainer);
            }
        }, 100);
    }

    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('toc-theme');
    const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (osPrefersDark) {
        currentTheme = 'dark';
    }

    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle();
    
    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href').substring(1);
            if (targetId.startsWith('#')) return;
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Toggle learning mode
    modeToggle.addEventListener('click', function() {
        currentMode = currentMode === 'academic' ? 'real-world' : 'academic';
        const modeText = currentMode === 'academic' ? 'Switch to Real-World Mode' : 'Switch to Academic Mode';
        modeToggle.innerHTML = `<i class="fas fa-exchange-alt"></i> <span>${modeText}</span>`;
        
        // Add visual feedback
        modeToggle.classList.add('active');
        setTimeout(() => {
            modeToggle.classList.remove('active');
        }, 300);
        
        // In a full implementation, this would change content display
        console.log(`Switched to ${currentMode} mode`);
        
        // Show notification
        showNotification(`Switched to ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode`);
    });
    
    // Chapter card interactions
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            openChapterDetails(topic);
        });
    });
    
    // Learning path interactions
    pathSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            activatePathStep(stepNumber);
        });
    });
    
    // Search functionality
    searchBar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterChapters(searchTerm);
    });
    
    // Function to open chapter details
    function openChapterDetails(topic) {
        // Update visualization panel
        updateVisualization(topic);
        
        // Highlight selected card
        chapterCards.forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`.chapter-card[data-topic="${topic}"]`).classList.add('selected');
        
        // Show notification
        showNotification(`Selected ${getTopicTitle(topic)}`);
    }

    // Function to update theme toggle button
    function updateThemeToggle() {
        const themeIcon = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        const themeText = currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        themeToggle.innerHTML = `<i class="${themeIcon}"></i> <span>${themeText}</span>`;
    }
    
    // Function to activate a learning path step
    function activatePathStep(stepNumber) {
        pathSteps.forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.path-step[data-step="${stepNumber}"]`).classList.add('active');
        
        // Scroll to the step
        document.querySelector(`.path-step[data-step="${stepNumber}"]`).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Show notification
        showNotification(`Activated Step ${stepNumber}`);
    }
    
    // Function to filter chapters based on search
    function filterChapters(term) {
        chapterCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('.card-content p').textContent.toLowerCase();
            
            if (title.includes(term) || content.includes(term)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Function to update visualization panel
    function updateVisualization(topic) {
        // Hide placeholder and show 3D visualization
        if (visualizationPlaceholder) {
            visualizationPlaceholder.style.display = 'none';
        }
        
        // Load visualization if visualizer is available
        if (visualizer) {
            visualizer.loadVisualization(topic);
        } else {
            // Fallback if Three.js is not available
            const visualizationPanel = document.querySelector('.visualization-panel');
            if (visualizationPanel) {
                visualizationPanel.innerHTML = `
                    <div class="visualization-content">
                        <h3>${getTopicTitle(topic)} Visualization</h3>
                        <div class="visualization-placeholder">
                            <i class="fas fa-cube fa-3x"></i>
                            <p>Interactive 3D visualization for ${getTopicTitle(topic)}</p>
                            <p class="instructions">Click and drag to rotate | Scroll to zoom</p>
                        </div>
                        <div class="visualization-controls">
                            <button class="control-btn" onclick="animateVisualization()"><i class="fas fa-play"></i> Animate</button>
                            <button class="control-btn" onclick="toggleFullscreen()"><i class="fas fa-expand"></i> Fullscreen</button>
                            <button class="control-btn" onclick="showInfo('${topic}')"><i class="fas fa-info-circle"></i> Info</button>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // Helper function to get topic title
    function getTopicTitle(topic) {
        const titles = {
            'language-grammar': 'Language and Grammar',
            'parse-tree': 'Parse Tree and Derivation',
            'fsa': 'Finite State Automata',
            'pda': 'Pushdown Automata',
            'turing-machine': 'Turing Machine',
            'pumping-lemma': 'Pumping Lemma',
            'cryptography': 'Cryptography'
        };
        return titles[topic] || topic;
    }
    
    // Visualization controls
    if (animateBtn) {
        animateBtn.addEventListener('click', function() {
            if (visualizer && visualizer.currentTopic) {
                showNotification(`Animating ${getTopicTitle(visualizer.currentTopic)}`);
                // Animate the visualization
                animateVisualization();
            } else {
                showNotification('Please select a topic first');
            }
        });
    }
    
    // Function to animate the visualization
    function animateVisualization() {
        if (!visualizer || !visualizer.camera) return;
        
        const startTime = Date.now();
        const duration = 5000; // 5 seconds
        const startX = visualizer.camera.position.x;
        const startY = visualizer.camera.position.y;
        const startZ = visualizer.camera.position.z;
        
        function rotate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Rotate camera around the scene
            const angle = progress * Math.PI * 2;
            visualizer.camera.position.x = Math.sin(angle) * 15;
            visualizer.camera.position.z = Math.cos(angle) * 15;
            visualizer.camera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(rotate);
            }
        }
        
        rotate();
    }
    
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            if (visualizer) {
                // Reset camera position
                if (visualizer.camera) {
                    visualizer.camera.position.set(0, 0, 15);
                    visualizer.camera.lookAt(0, 0, 0);
                }
                // Reset controls
                if (visualizer.controls) {
                    visualizer.controls.reset();
                }
                showNotification('View reset');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.chapter-card, .path-step, .visualization-panel');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.querySelectorAll('.chapter-card, .path-step, .visualization-panel').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger once on load
    animateOnScroll();
});

// Visualization control functions
function animateVisualization(topic) {
    console.log(`Animating ${topic} visualization`);
    showVisualizationNotification(`Animating ${getTopicTitle(topic)}`);
}

function toggleFullscreen() {
    console.log('Toggling fullscreen mode');
    showVisualizationNotification('Fullscreen mode activated');
}

function showInfo(topic) {
    console.log(`Showing info for ${topic}`);
    showVisualizationNotification(`Showing info for ${getTopicTitle(topic)}`);
}

// Notification system
function showNotification(message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 15px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }, 3000);
}

// Visualization notification system
function showVisualizationNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'viz-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.9);
        color: #0a0a1a;
        padding: 10px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        z-index: 100;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    const visualizationPanel = document.querySelector('.visualization-panel');
    if (visualizationPanel) {
        visualizationPanel.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
}