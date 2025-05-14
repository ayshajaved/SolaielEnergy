// Solar Profile Form Implementation
import { auth } from './db.js';

// Function to create and display the solar profile form
export function showSolarProfileForm(user) {
    // Create solar profile form
    const solarForm = document.createElement('form');
    solarForm.id = 'solar-profile-form';
    solarForm.style.textAlign = 'left';
    solarForm.style.backgroundColor = 'rgba(255, 165, 0, 0.1)';
    solarForm.style.padding = '1.5rem';
    solarForm.style.borderRadius = '8px';
    solarForm.style.marginTop = '1rem';
    solarForm.style.marginBottom = '1.5rem';
    
    // Roof Size Input
    const roofSizeGroup = document.createElement('div');
    roofSizeGroup.style.marginBottom = '1.5rem';
    
    const roofSizeLabel = document.createElement('label');
    roofSizeLabel.htmlFor = 'roof-size';
    roofSizeLabel.textContent = 'Roof Size (square meters)';
    roofSizeLabel.style.display = 'block';
    roofSizeLabel.style.color = 'white';
    roofSizeLabel.style.marginBottom = '0.5rem';
    roofSizeLabel.style.fontWeight = 'bold';
    
    const roofSizeInput = document.createElement('input');
    roofSizeInput.type = 'number';
    roofSizeInput.id = 'roof-size';
    roofSizeInput.min = '1';
    roofSizeInput.placeholder = 'Enter roof size';
    roofSizeInput.required = true;
    roofSizeInput.style.width = '100%';
    roofSizeInput.style.padding = '0.8rem';
    roofSizeInput.style.borderRadius = '4px';
    roofSizeInput.style.border = 'none';
    roofSizeInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    roofSizeInput.style.color = '#333'; // Changed text color to dark
    roofSizeInput.style.fontWeight = '500'; // Made text slightly bolder
    
    roofSizeGroup.appendChild(roofSizeLabel);
    roofSizeGroup.appendChild(roofSizeInput);
    solarForm.appendChild(roofSizeGroup);
    
    // Daily Energy Consumption Input
    const energyGroup = document.createElement('div');
    energyGroup.style.marginBottom = '1.5rem';
    
    const energyLabel = document.createElement('label');
    energyLabel.htmlFor = 'energy-consumption';
    energyLabel.textContent = 'Daily Average Energy Consumption (kWh)';
    energyLabel.style.display = 'block';
    energyLabel.style.color = 'white';
    energyLabel.style.marginBottom = '0.5rem';
    energyLabel.style.fontWeight = 'bold';
    
    const energyInput = document.createElement('input');
    energyInput.type = 'number';
    energyInput.id = 'energy-consumption';
    energyInput.min = '1';
    energyInput.step = '0.1';
    energyInput.placeholder = 'Enter daily kWh usage';
    energyInput.required = true;
    energyInput.style.width = '100%';
    energyInput.style.padding = '0.8rem';
    energyInput.style.borderRadius = '4px';
    energyInput.style.border = 'none';
    energyInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    energyInput.style.color = '#333'; // Changed text color to dark
    energyInput.style.fontWeight = '500'; // Made text slightly bolder
    
    energyGroup.appendChild(energyLabel);
    energyGroup.appendChild(energyInput);
    solarForm.appendChild(energyGroup);
    
    // Budget Options
    const budgetGroup = document.createElement('div');
    budgetGroup.style.marginBottom = '1.5rem';
    
    const budgetLabel = document.createElement('label');
    budgetLabel.textContent = 'Budget';
    budgetLabel.style.display = 'block';
    budgetLabel.style.color = 'white';
    budgetLabel.style.marginBottom = '0.5rem';
    budgetLabel.style.fontWeight = 'bold';
    
    const budgetOptions = document.createElement('div');
    budgetOptions.style.display = 'flex';
    budgetOptions.style.gap = '1rem';
    
    // Low Budget Option
    const lowBudgetLabel = document.createElement('label');
    lowBudgetLabel.style.display = 'flex';
    lowBudgetLabel.style.alignItems = 'center';
    lowBudgetLabel.style.cursor = 'pointer';
    lowBudgetLabel.style.padding = '0.5rem 1rem';
    lowBudgetLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    lowBudgetLabel.style.borderRadius = '4px';
    lowBudgetLabel.style.transition = 'background-color 0.3s';
    
    const lowBudgetRadio = document.createElement('input');
    lowBudgetRadio.type = 'radio';
    lowBudgetRadio.name = 'budget';
    lowBudgetRadio.id = 'low-budget';
    lowBudgetRadio.value = 'low';
    lowBudgetRadio.checked = true;
    lowBudgetRadio.style.marginRight = '0.5rem';
    
    lowBudgetLabel.appendChild(lowBudgetRadio);
    lowBudgetLabel.appendChild(document.createTextNode('Low Budget'));
    lowBudgetLabel.style.color = 'white';
    
    // High Budget Option
    const highBudgetLabel = document.createElement('label');
    highBudgetLabel.style.display = 'flex';
    highBudgetLabel.style.alignItems = 'center';
    highBudgetLabel.style.cursor = 'pointer';
    highBudgetLabel.style.padding = '0.5rem 1rem';
    highBudgetLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    highBudgetLabel.style.borderRadius = '4px';
    highBudgetLabel.style.transition = 'background-color 0.3s';
    
    const highBudgetRadio = document.createElement('input');
    highBudgetRadio.type = 'radio';
    highBudgetRadio.name = 'budget';
    highBudgetRadio.id = 'high-budget';
    highBudgetRadio.value = 'high';
    highBudgetRadio.style.marginRight = '0.5rem';
    
    highBudgetLabel.appendChild(highBudgetRadio);
    highBudgetLabel.appendChild(document.createTextNode('High Budget'));
    highBudgetLabel.style.color = 'white';
    
    // Add hover effects
    lowBudgetLabel.addEventListener('mouseenter', () => {
        lowBudgetLabel.style.backgroundColor = 'rgba(255, 165, 0, 0.3)';
    });
    lowBudgetLabel.addEventListener('mouseleave', () => {
        lowBudgetLabel.style.backgroundColor = lowBudgetRadio.checked ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)';
    });
    
    highBudgetLabel.addEventListener('mouseenter', () => {
        highBudgetLabel.style.backgroundColor = 'rgba(255, 165, 0, 0.3)';
    });
    highBudgetLabel.addEventListener('mouseleave', () => {
        highBudgetLabel.style.backgroundColor = highBudgetRadio.checked ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)';
    });
    
    // Add change event to update selected style
    lowBudgetRadio.addEventListener('change', () => {
        if (lowBudgetRadio.checked) {
            lowBudgetLabel.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
            highBudgetLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    highBudgetRadio.addEventListener('change', () => {
        if (highBudgetRadio.checked) {
            highBudgetLabel.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
            lowBudgetLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    budgetOptions.appendChild(lowBudgetLabel);
    budgetOptions.appendChild(highBudgetLabel);
    
    budgetGroup.appendChild(budgetLabel);
    budgetGroup.appendChild(budgetOptions);
    solarForm.appendChild(budgetGroup);
    
    // Backup Hours Slider
    const backupGroup = document.createElement('div');
    backupGroup.style.marginBottom = '1.5rem';
    
    const backupLabel = document.createElement('label');
    backupLabel.htmlFor = 'backup-hours';
    backupLabel.textContent = 'Backup Hours Needed';
    backupLabel.style.display = 'block';
    backupLabel.style.color = 'white';
    backupLabel.style.marginBottom = '0.5rem';
    backupLabel.style.fontWeight = 'bold';
    
    const backupValue = document.createElement('div');
    backupValue.id = 'backup-value';
    backupValue.textContent = '6 hours';
    backupValue.style.color = '#ffa500';
    backupValue.style.fontWeight = 'bold';
    backupValue.style.marginBottom = '0.5rem';
    backupValue.style.textAlign = 'center';
    
    const backupSlider = document.createElement('input');
    backupSlider.type = 'range';
    backupSlider.id = 'backup-hours';
    backupSlider.min = '2';
    backupSlider.max = '12';
    backupSlider.step = '2';
    backupSlider.value = '6';
    backupSlider.style.width = '100%';
    backupSlider.style.accentColor = '#ffa500';
    backupSlider.style.cursor = 'pointer';
    backupSlider.style.height = '8px'; // Made slider thicker
    
    // Add ticks for the slider
    const tickMarks = document.createElement('div');
    tickMarks.style.display = 'flex';
    tickMarks.style.justifyContent = 'space-between';
    tickMarks.style.marginTop = '0.5rem';
    
    const hours = [2, 4, 6, 8, 10, 12];
    hours.forEach(hour => {
        const tick = document.createElement('span');
        tick.textContent = `${hour}h`;
        tick.style.color = 'white';
        tick.style.fontSize = '0.8rem';
        tickMarks.appendChild(tick);
    });
    
    // Update value display when slider changes
    backupSlider.addEventListener('input', () => {
        backupValue.textContent = `${backupSlider.value} hours`;
    });
    
    backupGroup.appendChild(backupLabel);
    backupGroup.appendChild(backupValue);
    backupGroup.appendChild(backupSlider);
    backupGroup.appendChild(tickMarks);
    solarForm.appendChild(backupGroup);
    
    // Add form field descriptions for better UX
    const addDescription = (group, text) => {
        const description = document.createElement('p');
        description.textContent = text;
        description.style.color = 'rgba(255, 255, 255, 0.7)';
        description.style.fontSize = '0.85rem';
        description.style.marginTop = '0.3rem';
        description.style.fontStyle = 'italic';
        group.appendChild(description);
    };
    
    addDescription(roofSizeGroup, 'The available area on your roof for solar panels.');
    addDescription(energyGroup, 'Your average daily electricity consumption.');
    addDescription(budgetGroup, 'Choose based on your investment capacity.');
    addDescription(backupGroup, 'How many hours of backup power you need during outages.');
    
    // Generate AI Plan button
    const generatePlanBtn = document.createElement('button');
    generatePlanBtn.id = 'generate-plan-btn';
    generatePlanBtn.className = 'animated-button type--C';
    generatePlanBtn.type = 'button'; // Prevent form submission
    generatePlanBtn.innerHTML = `
        <div class="button__line"></div>
        <div class="button__line"></div>
        <span class="button__text">GENERATE AI PLAN</span>
        <div class="button__drow1"></div>
        <div class="button__drow2"></div>
    `;
    generatePlanBtn.style.width = '100%';
    generatePlanBtn.style.marginTop = '1rem';
    
    solarForm.appendChild(generatePlanBtn);
    
    // Add event listener to generate plan button
    generatePlanBtn.addEventListener('click', () => {
        // Get form values
        const roofSize = document.getElementById('roof-size').value;
        const energyConsumption = document.getElementById('energy-consumption').value;
        const budget = document.querySelector('input[name="budget"]:checked').value;
        const backupHours = document.getElementById('backup-hours').value;
        
        // Validate form
        if (!roofSize || !energyConsumption) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Call the generate plan function from the planner.js file
        import('./planner.js').then(module => {
            module.generateSolarPlan(user, {
                roofSize,
                energyConsumption,
                budget,
                backupHours
            });
        });
    });
    
    return solarForm;
}