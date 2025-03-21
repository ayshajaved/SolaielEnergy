// DOM Elements
const modalContainer = document.getElementById("modalContainer");
const plannerModal = document.getElementById("plannerModal");
const engineersModal = document.getElementById("engineersModal");
const chatModal = document.getElementById("chatModal");
const contactModal = document.getElementById("contactModal");

const plannerBtn = document.getElementById("plannerBtn");
const engineersBtn = document.getElementById("engineersBtn");
const chatBtn = document.getElementById("chatBtn");
const contactBtn = document.getElementById("contactBtn");
const closeModalBtns = document.querySelectorAll(".close-modal");

// Modal Functions
function openModal(modal) {
  modalContainer.style.display = "flex";
  modal.classList.add("active");
}

function closeModal() {
  modalContainer.style.display = "none";
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
  });
}

// Event Listeners for Buttons
plannerBtn.addEventListener("click", () => openModal(plannerModal));
engineersBtn.addEventListener("click", () => openModal(engineersModal));
chatBtn.addEventListener("click", () => openModal(chatModal));
contactBtn.addEventListener("click", () => openModal(contactModal));

closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

// Close modal when clicking outside
modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    closeModal();
  }
});

// 3D Solar System
let scene, camera, renderer, controls;
let sun, mercury, venus, earth, mars;

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function initSolarSystem() {
  // Create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(
    document.querySelector(".right-section").offsetWidth,
    document.querySelector(".right-section").offsetHeight,
  );
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Add controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add point light
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // Create sun
  const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xfdb813,
    emissive: 0xfdb813,
    emissiveIntensity: 1,
  });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Create planets
  // Mercury
  const mercuryGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const mercuryMaterial = new THREE.MeshStandardMaterial({ color: 0xa9a9a9 });
  mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
  const mercuryOrbit = new THREE.Object3D();
  mercuryOrbit.add(mercury);
  mercury.position.x = 2;
  scene.add(mercuryOrbit);

  // Venus
  const venusGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const venusMaterial = new THREE.MeshStandardMaterial({ color: 0xe6e6fa });
  venus = new THREE.Mesh(venusGeometry, venusMaterial);
  const venusOrbit = new THREE.Object3D();
  venusOrbit.add(venus);
  venus.position.x = 3;
  scene.add(venusOrbit);

  // Earth
  const earthGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x6495ed });
  earth = new THREE.Mesh(earthGeometry, earthMaterial);
  const earthOrbit = new THREE.Object3D();
  earthOrbit.add(earth);
  earth.position.x = 4;
  scene.add(earthOrbit);

  // Mars
  const marsGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xcd5c5c });
  mars = new THREE.Mesh(marsGeometry, marsMaterial);
  const marsOrbit = new THREE.Object3D();
  marsOrbit.add(mars);
  mars.position.x = 5;
  scene.add(marsOrbit);

  // Add stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });

  const starsVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate sun
    sun.rotation.y += 0.001;

    // Rotate planets around the sun
    scene.children.forEach((child) => {
      if (
        child instanceof THREE.Object3D &&
        child !== sun &&
        !(child instanceof THREE.Camera) &&
        !(child instanceof THREE.Points)
      ) {
        child.rotation.y += 0.01;
      }
    });

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    const width = document.querySelector(".right-section").offsetWidth;
    const height = document.querySelector(".right-section").offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

// Initialize solar system when page loads
window.addEventListener("load", initSolarSystem);

// Planner Modal Functionality
const roofSizeInput = document.getElementById("roofSize");
const roofSizeValue = document.getElementById("roofSizeValue");
const energyUsageInput = document.getElementById("energyUsage");
const energyUsageValue = document.getElementById("energyUsageValue");
const plannerForm = document.getElementById("plannerForm");
const recommendation = document.getElementById("recommendation");

roofSizeInput.addEventListener("input", () => {
  roofSizeValue.textContent = roofSizeInput.value;
});

energyUsageInput.addEventListener("input", () => {
  energyUsageValue.textContent = energyUsageInput.value;
});

plannerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const roofSize = Number.parseInt(roofSizeInput.value);
  const budget = Number.parseInt(document.getElementById("budget").value);
  const location = document.getElementById("location").value;
  const energyUsage = Number.parseInt(energyUsageInput.value);

  // Simple calculation for demonstration
  const panelCount = Math.floor(roofSize / 2);
  const estimatedCost = panelCount * 500;
  const estimatedProduction = panelCount * 300;
  const paybackPeriod = Math.round(estimatedCost / (estimatedProduction * 0.15));

  recommendation.innerHTML = `
        <h3>Your Recommendation</h3>
        <p>
            Based on your inputs, we recommend a ${panelCount} panel system.<br>
            Estimated cost: $${estimatedCost.toLocaleString()}<br>
            Estimated annual production: ${estimatedProduction.toLocaleString()} kWh<br>
            Estimated payback period: ${paybackPeriod} years
        </p>
    `;

  recommendation.classList.remove("hidden");
});

// Engineers Modal Functionality
const engineersForm = document.getElementById("engineersForm");
const engineersList = document.getElementById("engineersList");
const searchingEngineers = document.getElementById("searchingEngineers");

// Mock data for demonstration
const mockEngineers = [
  {
    id: 1,
    name: "Alex Johnson",
    location: "Phoenix, AZ",
    rating: 4.9,
    specialization: "Residential Solar",
    distance: 2.3,
  },
  {
    id: 2,
    name: "Maria Garcia",
    location: "Tempe, AZ",
    rating: 4.8,
    specialization: "Commercial Solar",
    distance: 5.1,
  },
  {
    id: 3,
    name: "David Chen",
    location: "Scottsdale, AZ",
    rating: 4.7,
    specialization: "Off-grid Systems",
    distance: 7.8,
  },
  {
    id: 4,
    name: "Sarah Williams",
    location: "Mesa, AZ",
    rating: 4.9,
    specialization: "Solar + Battery",
    distance: 8.5,
  },
  {
    id: 5,
    name: "James Taylor",
    location: "Chandler, AZ",
    rating: 4.6,
    specialization: "Residential Solar",
    distance: 10.2,
  },
];

engineersForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const zipCode = document.getElementById("zipCode").value;

  if (!zipCode) return;

  // Show loading state
  engineersList.innerHTML = "";
  searchingEngineers.classList.remove("hidden");

  // Simulate API call
  setTimeout(() => {
    searchingEngineers.classList.add("hidden");

    // Display engineers
    mockEngineers.forEach((engineer) => {
      const engineerCard = document.createElement("div");
      engineerCard.className = "engineer-card";
      engineerCard.innerHTML = `
                <div class="engineer-info">
                    <h3>${engineer.name}</h3>
                    <p>${engineer.location}</p>
                    <p>Specialization: ${engineer.specialization}</p>
                    <div class="engineer-rating">
                        <span>★</span>
                        <span>${engineer.rating}</span>
                    </div>
                </div>
                <div class="engineer-actions">
                    <div class="engineer-distance">${engineer.distance} miles away</div>
                    <button class="btn" style="margin-top: 0.5rem;">Contact</button>
                </div>
            `;

      engineersList.appendChild(engineerCard);
    });
  }, 1000);
});

// Chat Modal Functionality
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

let isTyping = false;

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = chatInput.value.trim();

  if (!message || isTyping) return;

  // Add user message
  addMessage(message, "user");
  chatInput.value = "";

  // Show typing indicator
  isTyping = true;
  addTypingIndicator();

  // Simulate AI response
  setTimeout(() => {
    removeTypingIndicator();
    addMessage(getAIResponse(message), "ai");
    isTyping = false;
  }, 1000);
});

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = `
        <div class="message-content">
            ${text}
        </div>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message ai";
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Simple response generator for demo purposes
function getAIResponse(question) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("cost") || lowerQuestion.includes("price")) {
    return "The cost of a solar system depends on several factors including your energy needs, roof size, and location. Typically, residential systems range from $15,000 to $25,000 before incentives and tax credits.";
  } else if (lowerQuestion.includes("save") || lowerQuestion.includes("savings")) {
    return "Most homeowners save between 40-70% on their electricity bills after installing solar panels. The exact amount depends on your current electricity rates, system size, and local sunlight conditions.";
  } else if (lowerQuestion.includes("install") || lowerQuestion.includes("installation")) {
    return "Installation typically takes 1-3 days for residential systems. Our professional team handles everything from permits to inspections, making the process hassle-free for you.";
  } else if (lowerQuestion.includes("battery") || lowerQuestion.includes("storage")) {
    return "Battery storage systems like the Tesla Powerwall or Enphase Encharge allow you to store excess solar energy for use during outages or at night. They typically add $8,000-$15,000 to the system cost.";
  } else {
    return "That's a great question about solar energy. Would you like me to connect you with one of our solar experts for more detailed information?";
  }
}

// Contact Modal Functionality
const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");
const submitContactBtn = document.getElementById("submitContactBtn");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show loading state
  submitContactBtn.textContent = "Sending...";
  submitContactBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    contactForm.style.display = "none";
    contactSuccess.classList.remove("hidden");
  }, 1500);
});

// Handle range input updates
document.addEventListener("DOMContentLoaded", () => {
  // Initialize range input values
  roofSizeValue.textContent = roofSizeInput.value;
  energyUsageValue.textContent = energyUsageInput.value;
});

// Handle window resize for responsive design
window.addEventListener("resize", () => {
  if (renderer) {
    const width = document.querySelector(".right-section").offsetWidth;
    const height = document.querySelector(".right-section").offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
});