// Firebase authentication implementation
import { firebaseConfig } from "./config.js"; // Make sure to add .js extension
import { showSolarProfileForm } from "./form.js";

// Initialize Firebase using the compat version
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

// Get elements
const googleSignInButton = document.getElementById('googleSignInButton');

// Function to create a clean welcome screen
function createWelcomeScreen(user) {
    // First, hide all sections
    const sections = document.querySelectorAll('section, .planner-bottom');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Create welcome container if it doesn't exist
    let welcomeContainer = document.getElementById('welcome-container');
    if (!welcomeContainer) {
        welcomeContainer = document.createElement('div');
        welcomeContainer.id = 'welcome-container';
        welcomeContainer.style.minHeight = '100vh';
        welcomeContainer.style.display = 'flex';
        welcomeContainer.style.justifyContent = 'center';
        welcomeContainer.style.alignItems = 'center';
        welcomeContainer.style.padding = '2rem';
        welcomeContainer.style.backgroundColor = 'black';
        document.body.appendChild(welcomeContainer);
    }
    
    // Create welcome card
    const welcomeCard = document.createElement('div');
    welcomeCard.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    welcomeCard.style.border = '1px solid rgba(255, 165, 0, 0.3)';
    welcomeCard.style.borderRadius = '10px';
    welcomeCard.style.padding = '3rem';
    welcomeCard.style.maxWidth = '800px';
    welcomeCard.style.width = '100%';
    welcomeCard.style.boxShadow = '0 0 30px rgba(255, 165, 0, 0.2)';
    welcomeCard.style.position = 'relative';
    
    // Add decorative circle
    const circle = document.createElement('div');
    circle.style.width = '20px';
    circle.style.height = '20px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = '#ffa500';
    circle.style.position = 'absolute';
    circle.style.top = '20px';
    circle.style.left = '20px';
    welcomeCard.appendChild(circle);
    
    // Add welcome header
    const header = document.createElement('h1');
    header.textContent = `WELCOME, ${user.displayName.toUpperCase()}!`;
    header.style.color = 'white';
    header.style.textAlign = 'center';
    header.style.marginBottom = '2rem';
    header.style.fontSize = '2.5rem';
    header.style.fontWeight = 'bold';
    header.style.textShadow = '0 0 10px rgba(255, 165, 0, 0.5)';
    welcomeCard.appendChild(header);
    
    // Add user info section
    const userInfo = document.createElement('div');
    userInfo.style.display = 'flex';
    userInfo.style.justifyContent = 'center';
    userInfo.style.alignItems = 'center';
    userInfo.style.marginBottom = '2rem';
    
    // Add profile picture or initial
    if (user.photoURL) {
        const profilePic = document.createElement('img');
        profilePic.src = user.photoURL;
        profilePic.style.width = '100px';
        profilePic.style.height = '100px';
        profilePic.style.borderRadius = '50%';
        profilePic.style.marginRight = '1.5rem';
        profilePic.style.border = '2px solid #ffa500';
        userInfo.appendChild(profilePic);
    } else {
        const initialCircle = document.createElement('div');
        initialCircle.style.width = '100px';
        initialCircle.style.height = '100px';
        initialCircle.style.borderRadius = '50%';
        initialCircle.style.backgroundColor = '#0077b6';
        initialCircle.style.display = 'flex';
        initialCircle.style.justifyContent = 'center';
        initialCircle.style.alignItems = 'center';
        initialCircle.style.marginRight = '1.5rem';
        initialCircle.style.fontSize = '3rem';
        initialCircle.style.color = 'white';
        initialCircle.textContent = user.displayName.charAt(0).toUpperCase();
        userInfo.appendChild(initialCircle);
    }
    
    // Add user details
    const details = document.createElement('div');
    details.innerHTML = `
        <p style="color: white; margin: 0.5rem 0; font-size: 1.2rem;">Email: ${user.email}</p>
        <p style="color: white; margin: 0.5rem 0; font-size: 1.2rem;">Account created: ${new Date(user.metadata.creationTime).toLocaleDateString()}</p>
    `;
    userInfo.appendChild(details);
    welcomeCard.appendChild(userInfo);
    
    // Add journey section
    const journeySection = document.createElement('div');
    journeySection.style.textAlign = 'center';
    journeySection.style.marginTop = '2rem';
    
    const journeyTitle = document.createElement('h2');
    journeyTitle.textContent = 'YOUR SOLAR JOURNEY';
    journeyTitle.style.color = '#ffa500';
    journeyTitle.style.marginBottom = '1.5rem';
    journeyTitle.style.fontSize = '1.8rem';
    journeySection.appendChild(journeyTitle);
    
    const journeyText = document.createElement('p');
    journeyText.textContent = 'Thank you for joining Solaiel Energy! We\'re excited to help you harness the power of solar energy. Complete your solar profile to get personalized recommendations and savings estimates.';
    journeyText.style.color = 'white';
    journeyText.style.lineHeight = '1.6';
    journeyText.style.marginBottom = '2rem';
    journeySection.appendChild(journeyText);
    
    // Add the solar profile form from form.js
    const solarForm = showSolarProfileForm(user);
    journeySection.appendChild(solarForm);
    
    // Add logout button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = '2rem';
    
    // Logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'welcome-logout';
    logoutBtn.className = 'animated-button type--C';
    logoutBtn.innerHTML = `
        <div class="button__line"></div>
        <div class="button__line"></div>
        <span class="button__text">LOGOUT</span>
        <div class="button__drow1"></div>
        <div class="button__drow2"></div>
    `;
    buttonContainer.appendChild(logoutBtn);
    
    journeySection.appendChild(buttonContainer);
    welcomeCard.appendChild(journeySection);
    
    // Add the welcome card to the container
    welcomeContainer.innerHTML = '';
    welcomeContainer.appendChild(welcomeCard);
    
    // Add event listener to logout button
    document.getElementById('welcome-logout').addEventListener('click', handleLogout);
}

// Function to handle Google Sign-In
function signInWithGoogle() {
    console.log("Sign in with Google clicked");
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // User is signed in
            const user = result.user;
            console.log("User signed in:", user.displayName);
            
            // Create welcome screen
            createWelcomeScreen(user);
        })
        .catch((error) => {
            // Handle Errors here.
            console.error("Error during sign-in:", error);
            alert("Sign-in error: " + error.message);
        });
}

// Function to handle logout
function handleLogout() {
    console.log("Logout clicked");
    
    auth.signOut()
        .then(() => {
            // User is signed out
            console.log("User signed out");
            
            // Remove welcome container
            const welcomeContainer = document.getElementById('welcome-container');
            if (welcomeContainer) {
                welcomeContainer.remove();
            }
            
            // Show all sections again
            const sections = document.querySelectorAll('section, .planner-bottom');
            sections.forEach(section => {
                section.style.display = '';
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
        })
        .catch((error) => {
            // Handle Errors here.
            console.error("Error during logout:", error);
            alert("Logout error: " + error.message);
        });
}

// Check if user is already signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("User is already signed in:", user.displayName);
        createWelcomeScreen(user);
    } else {
        // User is signed out
        console.log("User is signed out");
        const welcomeContainer = document.getElementById('welcome-container');
        if (welcomeContainer) {
            welcomeContainer.remove();
        }
        
        // Show all sections
        const sections = document.querySelectorAll('section, .planner-bottom');
        sections.forEach(section => {
            section.style.display = '';
        });
    }
});

// Add event listeners
googleSignInButton.addEventListener('click', signInWithGoogle);

console.log("Firebase authentication initialized");