// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2500);
});

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Original GSAP animations for the SVG
const tl = gsap.timeline({
    defaults: {
        duration: 2,
        yoyo: true,
        ease: 'power2.inOut'
    }
})
.fromTo('.left, .right', {
    svgOrigin: '640 500',
    skewY: (i) => [-30, 15][i],
    scaleX: (i) => [0.6, 0.85][i],
    x: 200
}, {
    skewY: (i) => [-15, 30][i],
    scaleX: (i) => [0.85, 0.6][i],
    x: -200
})
.play(0.5);

// Updated synchronized text animation
const tl2 = gsap.timeline();
const allTexts = gsap.utils.toArray('.left text, .right text');

gsap.set(allTexts, {
    xPercent: -100,
    x: 700
});

tl2.to(allTexts, {
    duration: 1,
    xPercent: 0,
    x: 575,
    ease: 'sine.inOut',
    stagger: 0 // This ensures all texts move together
});

window.onpointermove = (e) => {
    tl.pause();
    tl2.pause();
    gsap.to([tl, tl2], {
        duration: 2,
        ease: 'power4',
        progress: e.x / innerWidth
    });
};

// Initialize section animations
document.addEventListener('DOMContentLoaded', () => {
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1
        });
    });

    gsap.utils.toArray('.section-content').forEach(content => {
        gsap.from(content, {
            scrollTrigger: {
                trigger: content,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3
        });
    });
});

/* Remove the card-related JavaScript code:
- Remove the panels querySelector
- Remove the click event listeners for panels
*/

// Enhanced cursor effect
// Custom cursor
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.createElement('div');
    cursor.classList.add('circle-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - cursor.offsetWidth / 2 + 'px';
        cursor.style.top = e.clientY - cursor.offsetHeight / 2 + 'px';
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, .nav-btn, a, input');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
});

// Add hollow cursor effect for navigation buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        cursor.classList.add('hollow');
    });
    
    btn.addEventListener('mouseleave', () => {
        cursor.classList.remove('hollow');
    });
});

// Add this to your existing script.js file

// Function to handle the loader and initial animations
function handleLoader() {
    const preloader = document.getElementById('preloader');
    const homeSection = document.querySelector('#home');
    
    // Make sure loader is visible
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.style.opacity = '1';
        
        // After 2 seconds, hide the loader and show the home section
        setTimeout(() => {
            preloader.style.opacity = '0';
            
            // After transition completes, hide the loader completely
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Show home section
                homeSection.classList.add('visible');
                
                // Show the tagline with animation
                const tagline = document.querySelector('.tagline');
                if (tagline) {
                    tagline.classList.add('tagline-visible');
                }
                
                // Initialize scroll animations
                handleScrollAnimations();
            }, 500); // Wait for opacity transition to complete
            
        }, 2000); // Show loader for 2 seconds
    }
}

// Function to handle scroll animations
function handleScrollAnimations() {
    const sections = document.querySelectorAll('.page-section:not(#home)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate cards when their section becomes visible
                if (entry.target.id === 'about') {
                    const cards = entry.target.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('card-visible');
                        }, index * 200);
                    });
                }
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize when the page is fully loaded
window.addEventListener('load', () => {
    // Add card index as a custom property for staggered animations
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index + 1);
    });
    
    // Start the loader sequence
    handleLoader();
});

// Add this to your existing script.js file to fix scrolling issues

// Function to animate the tagline when the page loads
function animateTagline() {
    // Show the tagline with animation after a short delay
    setTimeout(() => {
        const tagline = document.querySelector('.tagline');
        if (tagline) {
            tagline.classList.add('tagline-visible');
        }
    }, 2500); // Delay after loader disappears
}

// Handle navigation button active states
function setupNavigation() {
    const sections = document.querySelectorAll('.page-section');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    // Set initial active state based on current visible section
    function setInitialActiveButton() {
        // Default to home
        let activeSection = 'home';
        
        // Check if another section is more visible
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
                activeSection = section.getAttribute('id');
            }
        });
        
        // Set the active button
        navBtns.forEach(btn => {
            if (btn.getAttribute('data-section') === activeSection) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Set initial state when page loads
    setInitialActiveButton();
    
    // Update active state on click
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            navBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to corresponding section
            const targetSection = document.getElementById(this.getAttribute('data-section'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', function() {
        let currentSection = '';
        let maxVisibility = 0;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionHeight = section.clientHeight;
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibilityRatio = visibleHeight / sectionHeight;
            
            if (visibilityRatio > maxVisibility && visibilityRatio > 0.3) {
                maxVisibility = visibilityRatio;
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            navBtns.forEach(btn => {
                if (btn.getAttribute('data-section') === currentSection) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });
}

// Add this to your existing window.addEventListener('load', ...) function
window.addEventListener('load', function() {
    // Your existing code...
    
    // Setup navigation
    setupNavigation();
});

// Add this to your existing script.js file

// Fix scrolling issues
document.addEventListener('DOMContentLoaded', function() {
    // Ensure body has proper height
    document.body.style.minHeight = '100vh';
    document.body.style.position = 'relative';
    
    // Fix any potential issues with fixed elements
    const fixedElements = document.querySelectorAll('.loading');
    fixedElements.forEach(el => {
        el.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'opacity' && this.style.opacity === '0') {
                this.style.pointerEvents = 'none';
            }
        });
    });
    
    // Ensure all sections are properly sized
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.style.overflow = 'visible';
    });
});

// Add smooth scrolling for the Learn More button
document.querySelector('.card:nth-child(2) .btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#services').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    const roofSlider = document.getElementById('roofSize');
    const valueDisplay = roofSlider.nextElementSibling;
    
    roofSlider.addEventListener('input', function() {
        valueDisplay.textContent = this.value + ' sq ft';
    });
});

// Single device handler function
function initializeDeviceHandler() {
    const deviceList = document.querySelector('.device-list');
    const selectedDevices = document.querySelector('.selected-devices');
    const addDeviceBtn = document.querySelector('.add-device');

    // Keep only the first device item
    const firstDeviceItem = deviceList.querySelector('.device-item');
    deviceList.innerHTML = '';
    deviceList.appendChild(firstDeviceItem);

    function handleAddDevice() {
        const select = firstDeviceItem.querySelector('select');
        const quantity = firstDeviceItem.querySelector('.quantity');
        const hours = firstDeviceItem.querySelector('.hours');
        
        if (select.value) {
            const deviceText = select.options[select.selectedIndex].text;
            selectedDevices.insertAdjacentHTML('beforeend', `
                <div class="selected-device">
                    <span>${deviceText} × ${quantity.value} (${hours.value}hrs/day)</span>
                    <button class="remove-selected">×</button>
                </div>
            `);
            
            // Reset inputs
            select.value = '';
            quantity.value = '1';
            hours.value = '8';
        }
    }

    // Remove old event listener and add new one
    const newAddBtn = addDeviceBtn.cloneNode(true);
    addDeviceBtn.parentNode.replaceChild(newAddBtn, addDeviceBtn);
    newAddBtn.addEventListener('click', handleAddDevice);

    // Event delegation for remove buttons
    selectedDevices.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-selected')) {
            e.target.parentElement.remove();
        }
    });
}

// Initialize device handler once DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDeviceHandler);

// Add this to your existing script.js file

// Add suggested questions display and handling
// Initialize chatbot when DOM loads
// Add this to your initializeChatbot function
function initializeChatbot() {
    const suggestedQuestions = [
        "Introduce yourself solaiel...",
        "How can I plan solar system for my house?",
        "What does the solar system consist of?",
        "How long do solar panels last?",
        "What maintenance is required?",
        "How can I find installer?"
    ];

    // Add suggested questions to the chat interface
    const chatContainer = document.querySelector('.chatbot-container');
    
    // Create a container for the suggested questions that will be inside the chat
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggested-questions';
    
    // Style the suggestions container
    suggestionsDiv.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px;
        margin-top: 10px;
        border-top: 1px solid rgba(201, 123, 20, 0.3);
        background: rgba(0, 0, 0, 0.2);
    `;
    
    // Add a title for the suggestions
    const title = document.createElement('div');
    title.textContent = 'Ask me about:';
    title.style.cssText = `
        width: 100%;
        color: #ff9d2f;
        font-size: 0.9rem;
        margin-bottom: 8px;
    `;
    suggestionsDiv.appendChild(title);
    
    // Add the question buttons
    suggestedQuestions.forEach(question => {
        const btn = document.createElement('button');
        btn.className = 'question-suggestion';
        btn.textContent = question;
        btn.onclick = () => sendMessage(question);
        
        // Style the buttons
        btn.style.cssText = `
            background: rgba(201, 123, 20, 0.2);
            border: 1px solid rgba(201, 123, 20, 0.4);
            color: white;
            padding: 6px 10px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        `;
        
        // Add hover effect
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(201, 123, 20, 0.4)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(201, 123, 20, 0.2)';
        });
        
        suggestionsDiv.appendChild(btn);
    });

    // Insert the suggestions div at the top of the chat messages
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        // Hide scrollbar but keep scroll functionality
        chatMessages.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
        `;
        
        // Hide scrollbar for Chrome, Safari and Opera
        const style = document.createElement('style');
        style.textContent = `
            #chat-messages::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        chatMessages.insertBefore(suggestionsDiv, chatMessages.firstChild);
    }

    // Add event listener for Enter key in chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage(this.value);
            }
        });
    }
}

// Function to send message and get response
async function sendMessage(message) {
    if (!message.trim()) return;
    
    const chatMessages = document.getElementById('chat-messages');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    const inputField = document.getElementById('chat-input');
    if (inputField) inputField.value = '';
    
    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading';
    loadingDiv.textContent = 'Typing...';
    chatMessages.appendChild(loadingDiv);
    
    // Scroll to latest message immediately after adding user message
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bot response:', data); // Debug log
        
        loadingDiv.remove();
        
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.textContent = data.response;
        chatMessages.appendChild(botMessage);
        
        // Scroll to latest message again after adding bot response
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } catch (error) {
        console.error('Chat error:', error);
        loadingDiv.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot-message error';
        errorDiv.textContent = 'Error connecting to the server. Please try again.';
        chatMessages.appendChild(errorDiv);
        
        // Scroll to error message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initializeChatbot);
