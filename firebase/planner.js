// Solar Planner Implementation

// Function to generate a solar plan based on user inputs
export function generateSolarPlan(user, formData) {
    // Get the welcome container
    const welcomeContainer = document.getElementById('welcome-container');
    if (!welcomeContainer) {
        console.error('Welcome container not found');
        return;
    }
    
    const welcomeCard = welcomeContainer.querySelector('div');
    if (!welcomeCard) {
        console.error('Welcome card not found');
        return;
    }
    
    // Clear the welcome card content
    welcomeCard.innerHTML = '';
    
    // Add loading animation
    const loadingElement = document.createElement('div');
    loadingElement.style.textAlign = 'center';
    loadingElement.style.padding = '3rem';
    
    const loadingText = document.createElement('h2');
    loadingText.textContent = 'Generating Your AI Solar Plan';
    loadingText.style.color = 'white';
    loadingText.style.marginBottom = '2rem';
    
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.style.border = '5px solid rgba(255, 255, 255, 0.3)';
    loadingSpinner.style.borderTop = '5px solid #ffa500';
    loadingSpinner.style.borderRadius = '50%';
    loadingSpinner.style.width = '50px';
    loadingSpinner.style.height = '50px';
    loadingSpinner.style.animation = 'spin 1s linear infinite';
    loadingSpinner.style.margin = '0 auto';
    
    // Add keyframes for spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    loadingElement.appendChild(loadingText);
    loadingElement.appendChild(loadingSpinner);
    welcomeCard.appendChild(loadingElement);
    
    // Simulate API call delay
    setTimeout(() => {
        // Calculate system details based on inputs
        const { roofSize, energyConsumption, budget, backupHours } = formData;
        
        // Convert energy consumption to watts
        const dailyConsumptionWatts = parseFloat(energyConsumption) * 1000;
        
        // Calculate inverter size (40% more than daily consumption, rounded to market sizes)
        const rawInverterSize = dailyConsumptionWatts * 1.4;
        let inverterSizeWatts;
        
        // Round to common market sizes (1kW, 2kW, 3kW, 5kW, etc.)
        if (rawInverterSize <= 1200) {
            inverterSizeWatts = 1000; // 1kW
        } else if (rawInverterSize <= 2200) {
            inverterSizeWatts = 2000; // 2kW
        } else if (rawInverterSize <= 3300) {
            inverterSizeWatts = 3000; // 3kW
        } else if (rawInverterSize <= 5500) {
            inverterSizeWatts = 5000; // 5kW
        } else if (rawInverterSize <= 8800) {
            inverterSizeWatts = 8000; // 8kW
        } else if (rawInverterSize <= 16800) {
            inverterSizeWatts = 16000; // 16kW
        } else {
            inverterSizeWatts = Math.ceil(rawInverterSize / 1000) * 1000; // Round up to nearest 1kW
        }
        
        // Determine battery voltage based on consumption
        let batteryVoltage;
        if (parseFloat(energyConsumption) <= 1) {
            batteryVoltage = 12; // 12V for up to 1kWh
        } else if (parseFloat(energyConsumption) <= 5) {
            batteryVoltage = 24; // 24V for 1-5kWh
        } else {
            batteryVoltage = 48; // 48V for above 5kWh
        }
        
        // Calculate battery ampere-hours
        // Formula: (Daily consumption in watts × Backup hours) ÷ Battery voltage
        const batteryAmpereHours = Math.ceil((dailyConsumptionWatts * parseFloat(backupHours)) / batteryVoltage);
        
        // Round to common battery sizes (100Ah, 150Ah, 200Ah, etc.)
        let marketBatteryAh;
        if (batteryAmpereHours <= 100) {
            marketBatteryAh = 100;
        } else if (batteryAmpereHours <= 150) {
            marketBatteryAh = 150;
        } else if (batteryAmpereHours <= 200) {
            marketBatteryAh = 200;
        } else {
            // For larger systems, calculate number of batteries needed
            marketBatteryAh = 200;
        }
        
        // Calculate number of batteries needed
        const numberOfBatteries = Math.ceil(batteryAmpereHours / marketBatteryAh);
        
        // Calculate energy savings per year (kWh/year)
        const energySavingsPerYear = parseFloat(energyConsumption) * 365;
        
        // Calculate CO2 reduction (kg/year)
        // Formula: Energy savings (kWh/year) × 0.6 kg CO2/kWh
        const co2ReductionPerYear = energySavingsPerYear * 0.6;
        
        // Calculate panel count based on energy consumption
        // Each 400W panel produces approximately 1.6 kWh per day in Pakistan
        const panelCount = Math.ceil((parseFloat(energyConsumption) * 1000) / 400);
        const systemSizeKW = (panelCount * 0.4).toFixed(1);
        
        // Calculate estimated cost based on components and budget
        const panelCostPerWatt = budget === 'low' ? 75 : 110; // PKR per watt
        const batteryCostPerAh = budget === 'low' ? 400 : 600; // PKR per Ah
        const inverterCostPerWatt = budget === 'low' ? 15 : 25; // PKR per watt
        
        const panelsCost = systemSizeKW * 1000 * panelCostPerWatt;
        const batteriesCost = batteryVoltage * marketBatteryAh * numberOfBatteries * batteryCostPerAh / 100;
        const inverterCost = inverterSizeWatts * inverterCostPerWatt / 100;
        
        const estimatedCost = panelsCost + batteriesCost + inverterCost;
        
        // Calculate monthly savings (based on current electricity rate of PKR 38 per kWh)
        const monthlySavings = (parseFloat(energyConsumption) * 30 * 38).toFixed(0);
        const paybackYears = (estimatedCost / (monthlySavings * 12)).toFixed(1);
        
        // Create results display
        welcomeCard.innerHTML = '';
        
        // Add header
        const header = document.createElement('h1');
        header.textContent = 'YOUR AI SOLAR PLAN';
        header.style.color = '#ffa500';
        header.style.textAlign = 'center';
        header.style.marginBottom = '2rem';
        header.style.fontSize = '2.5rem';
        header.style.fontWeight = 'bold';
        welcomeCard.appendChild(header);
        
        // Create results grid
        const resultsGrid = document.createElement('div');
        resultsGrid.style.display = 'grid';
        resultsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        resultsGrid.style.gap = '1.5rem';
        resultsGrid.style.marginBottom = '2rem';
        
        // System Details Card
        const systemCard = document.createElement('div');
        systemCard.style.backgroundColor = 'rgba(255, 165, 0, 0.1)';
        systemCard.style.borderRadius = '8px';
        systemCard.style.padding = '1.5rem';
        systemCard.style.border = '1px solid rgba(255, 165, 0, 0.3)';
        
        const systemTitle = document.createElement('h3');
        systemTitle.textContent = 'SYSTEM DETAILS';
        systemTitle.style.color = 'white';
        systemTitle.style.marginBottom = '1rem';
        systemTitle.style.borderBottom = '1px solid rgba(255, 165, 0, 0.3)';
        systemTitle.style.paddingBottom = '0.5rem';
        systemTitle.style.textAlign = 'center';
        
        // After calculating inverterSizeWatts, add this new code
        let solarPanelWatts;
        let numberOfPanels;
        
        // Determine solar panel size based on daily consumption
        if (parseFloat(energyConsumption) <= 1) {
        // For consumption up to 1kWh
        solarPanelWatts = 150;
        } else if (parseFloat(energyConsumption) <= 5) {
        // For consumption between 1-5kWh
        if (budget === 'low') {
        solarPanelWatts = 250; // Economy option
        } else {
        // Premium options based on consumption
        if (parseFloat(energyConsumption) <= 2) {
        solarPanelWatts = 300;
        } else if (parseFloat(energyConsumption) <= 3.5) {
        solarPanelWatts = 325;
        } else {
        solarPanelWatts = 400;
        }
        }
        } else {
        // For consumption above 5kWh
        solarPanelWatts = 700;
        }
        
        // Calculate number of panels needed
        numberOfPanels = Math.ceil(inverterSizeWatts / solarPanelWatts);
        
        // Update the systemDetails HTML to include panel information
        const systemDetails = document.createElement('div');
        systemDetails.innerHTML = `
        <p style="color: white; margin: 0.5rem 0;"><strong>Daily Consumption:</strong> ${energyConsumption} kWh</p>
        <p style="color: white; margin: 0.5rem 0;"><strong>Inverter Size:</strong> ${(inverterSizeWatts/1000).toFixed(1)} kW</p>
        <p style="color: white; margin: 0.5rem 0;"><strong>Solar Panels:</strong> ${numberOfPanels}x ${solarPanelWatts}W</p>
        <p style="color: white; margin: 0.5rem 0;"><strong>Total Solar Capacity:</strong> ${((numberOfPanels * solarPanelWatts)/1000).toFixed(1)} kW</p>
        <p style="color: white; margin: 0.5rem 0;"><strong>Battery System:</strong> ${batteryVoltage}V, ${marketBatteryAh}Ah x ${numberOfBatteries}</p>
        <p style="color: white; margin: 0.5rem 0;"><strong>Backup Time:</strong> ${backupHours} hours</p>
        <p style="color: white; margin: 0.5rem 0;"><strong>Roof Area Used:</strong> ${roofSize} m²</p>
        `;
        
        systemCard.appendChild(systemTitle);
        systemCard.appendChild(systemDetails);
        resultsGrid.appendChild(systemCard);
        
        // Environmental Impact Card
        const environmentalCard = document.createElement('div');
        environmentalCard.style.backgroundColor = 'rgba(255, 165, 0, 0.1)';
        environmentalCard.style.borderRadius = '8px';
        environmentalCard.style.padding = '1.5rem';
        environmentalCard.style.border = '1px solid rgba(255, 165, 0, 0.3)';
        
        const environmentalTitle = document.createElement('h3');
        environmentalTitle.textContent = 'ENVIRONMENTAL IMPACT';
        environmentalTitle.style.color = 'white';
        environmentalTitle.style.marginBottom = '1rem';
        environmentalTitle.style.borderBottom = '1px solid rgba(255, 165, 0, 0.3)';
        environmentalTitle.style.paddingBottom = '0.5rem';
        environmentalTitle.style.textAlign = 'center';
        
        const environmentalDetails = document.createElement('div');
        environmentalDetails.innerHTML = `
            <p style="color: white; margin: 0.5rem 0;"><strong>Energy Savings:</strong> ${energySavingsPerYear.toFixed(1)} kWh/year</p>
            <p style="color: white; margin: 0.5rem 0;"><strong>CO₂ Reduction:</strong> ${co2ReductionPerYear.toFixed(1)} kg/year</p>
            <p style="color: white; margin: 0.5rem 0;"><strong>Equivalent to:</strong> ${(co2ReductionPerYear / 200).toFixed(1)} trees planted</p>
            <p style="color: white; margin: 0.5rem 0;"><strong>Lifetime CO₂ Offset:</strong> ${(co2ReductionPerYear * 25).toFixed(0)} kg</p>
        `;
        
        environmentalCard.appendChild(environmentalTitle);
        environmentalCard.appendChild(environmentalDetails);
        resultsGrid.appendChild(environmentalCard);
        
        welcomeCard.appendChild(resultsGrid);
        
        // Add recommendation
        const recommendation = document.createElement('div');
        recommendation.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
        recommendation.style.borderRadius = '8px';
        recommendation.style.padding = '1.5rem';
        recommendation.style.marginBottom = '2rem';
        recommendation.style.textAlign = 'center';
        
        const recommendationTitle = document.createElement('h3');
        recommendationTitle.textContent = 'AI RECOMMENDATION';
        recommendationTitle.style.color = 'white';
        recommendationTitle.style.marginBottom = '1rem';
        
        // Update the recommendation text
        const recommendationText = document.createElement('p');
        recommendationText.style.color = 'white';
        recommendationText.style.lineHeight = '1.6';
        
        // Generate recommendation based on inputs with added cost and installer information
        if (parseFloat(backupHours) > 8) {
            recommendationText.textContent = `For optimal battery life and cost efficiency, we recommend a backup time of 6-8 hours for most residential systems. The exact cost and payback period will be confirmed by your local installers. Please use our "FIND INSTALLERS" feature to connect with certified professionals near you.`;
        } else if (inverterSizeWatts > 5000 && batteryVoltage < 48) {
            recommendationText.textContent = `For your energy consumption level, we recommend upgrading to a 48V battery system for better efficiency and performance with your ${(inverterSizeWatts/1000).toFixed(1)}kW inverter. The exact cost and payback period will be confirmed by your local installers. Please use our "FIND INSTALLERS" feature to connect with certified professionals near you.`;
        } else {
            recommendationText.textContent = `Based on your inputs, we've designed an optimal solar system that balances your energy needs and backup requirements. This system will provide reliable power and significant savings over its lifetime. The exact cost and payback period will be confirmed by your local installers. Please use our "FIND INSTALLERS" feature to connect with certified professionals near you.`;
        }
        
        recommendation.appendChild(recommendationTitle);
        recommendation.appendChild(recommendationText);
        welcomeCard.appendChild(recommendation);
        
        // Add buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '1.5rem';
        buttonContainer.style.flexWrap = 'wrap';
        
        // Find Installers button
        const findInstallersBtn = document.createElement('button');
        findInstallersBtn.className = 'animated-button type--C';
        findInstallersBtn.innerHTML = `
            <div class="button__line"></div>
            <div class="button__line"></div>
            <span class="button__text">FIND INSTALLERS</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
        `;
        
        // Download Plan button
        const downloadPlanBtn = document.createElement('button');
        downloadPlanBtn.className = 'animated-button type--C';
        downloadPlanBtn.innerHTML = `
            <div class="button__line"></div>
            <div class="button__line"></div>
            <span class="button__text">DOWNLOAD PLAN</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
        `;
        
        // Solaiel Chatbot button
        const chatbotBtn = document.createElement('button');
        chatbotBtn.className = 'animated-button type--C';
        chatbotBtn.innerHTML = `
            <div class="button__line"></div>
            <div class="button__line"></div>
            <span class="button__text">ASK SOLAIEL AI</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
        `;
        
        // Back to Home button
        const backToHomeBtn = document.createElement('button');
        backToHomeBtn.id = 'back-to-home';
        backToHomeBtn.className = 'animated-button type--C';
        backToHomeBtn.innerHTML = `
            <div class="button__line"></div>
            <div class="button__line"></div>
            <span class="button__text">BACK TO HOME</span>
            <div class="button__drow1"></div>
            <div class="button__drow2"></div>
        `;
        
        buttonContainer.appendChild(findInstallersBtn);
        buttonContainer.appendChild(downloadPlanBtn);
        buttonContainer.appendChild(chatbotBtn);
        buttonContainer.appendChild(backToHomeBtn);
        welcomeCard.appendChild(buttonContainer);
        
        // Add event listeners for buttons
        findInstallersBtn.addEventListener('click', () => {
            // Remove welcome container
            welcomeContainer.remove();
            
            // Show all sections again
            const sections = document.querySelectorAll('section, .planner-bottom');
            sections.forEach(section => {
                section.style.display = '';
            });
            
            // Navigate to installers section
            window.location.hash = '#contact';
        });
        
        downloadPlanBtn.addEventListener('click', () => {
            // Generate PDF using jsPDF
            try {
                // Check if jsPDF is loaded
                if (typeof jspdf === 'undefined') {
                    // Load jsPDF dynamically if not already loaded
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    script.onload = function() {
                        generateAndDownloadPDF();
                    };
                    document.head.appendChild(script);
                } else {
                    generateAndDownloadPDF();
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            }
        });
        
        // Function to generate and download PDF
        function generateAndDownloadPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(22);
            doc.setTextColor(255, 165, 0);
            doc.text('YOUR AI SOLAR PLAN', 105, 20, { align: 'center' });
            
            // Add user info
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Generated for: ${user.displayName || user.email}`, 20, 30);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);
            
            // Add system details
            doc.setFontSize(16);
            doc.setTextColor(255, 165, 0);
            doc.text('System Details', 20, 50);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Daily Consumption: ${energyConsumption} kWh`, 20, 60);
            doc.text(`Inverter Size: ${(inverterSizeWatts/1000).toFixed(1)} kW`, 20, 67);
            doc.text(`Battery System: ${batteryVoltage}V, ${marketBatteryAh}Ah x ${numberOfBatteries}`, 20, 74);
            doc.text(`Backup Time: ${backupHours} hours`, 20, 81);
            doc.text(`Roof Area: ${roofSize} m²`, 20, 88);
            
            // Add environmental impact
            doc.setFontSize(16);
            doc.setTextColor(255, 165, 0);
            doc.text('Environmental Impact', 20, 107);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Energy Savings: ${energySavingsPerYear.toFixed(1)} kWh/year`, 20, 110);
            doc.text(`CO₂ Reduction: ${co2ReductionPerYear.toFixed(1)} kg/year`, 20, 117);
            doc.text(`Equivalent to: ${(co2ReductionPerYear / 200).toFixed(1)} trees planted`, 20, 124);
            doc.text(`Lifetime CO₂ Offset: ${(co2ReductionPerYear * 25).toFixed(0)} kg`, 20, 131);
            
            // Add recommendation
            doc.setFontSize(16);
            doc.setTextColor(255, 165, 0);
            doc.text('AI Recommendation', 20, 150);
            
            // Get recommendation text
            let recommendationText = '';
            if (parseFloat(backupHours) > 8) {
                recommendationText = `For optimal battery life and cost efficiency, we recommend a backup time of 6-8 hours for most residential systems. The exact cost and payback period will be confirmed by your local installers.`;
            } else if (inverterSizeWatts > 5000 && batteryVoltage < 48) {
                recommendationText = `For your energy consumption level, we recommend upgrading to a 48V battery system for better efficiency and performance with your ${(inverterSizeWatts/1000).toFixed(1)}kW inverter. The exact cost and payback period will be confirmed by your local installers.`;
            } else {
                recommendationText = `Based on your inputs, we've designed an optimal solar system that balances your energy needs and backup requirements. This system will provide reliable power and significant savings over its lifetime. The exact cost and payback period will be confirmed by your local installers.`;
            }
            
            // Add wrapped text for recommendation
            const splitRecommendation = doc.splitTextToSize(recommendationText, 170);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(splitRecommendation, 20, 160);
            
            // Add footer
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            doc.text('Generated by Solaiel Energy - Pakistan\'s Solar Revolution', 105, 280, { align: 'center' });
            
            // Save the PDF
            doc.save(`Solaiel_Solar_Plan_${new Date().toISOString().slice(0,10)}.pdf`);
        }
        
        backToHomeBtn.addEventListener('click', () => {
            // Remove welcome container
            welcomeContainer.remove();
            
            // Show all sections again
            const sections = document.querySelectorAll('section, .planner-bottom');
            sections.forEach(section => {
                section.style.display = '';
            });
            
            // Navigate to home section
            window.location.hash = '#home';
        });
    }, 2000); // End of setTimeout for loading simulation
} // End of generateSolarPlan function

// Update the PDF generation function to include daily consumption
