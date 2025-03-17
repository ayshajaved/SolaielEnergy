# Solaiel Energy

"**Bright Ideas, Local Ties, Solar Rise.**"

Welcome to the repository for **Solaiel Energy**, a project developed as part of the GDSC Solution Challenge. Solaiel Energy is both a mobile app and a website designed to empower users with innovative solar energy solutions.

## Origin
The name "Solaiel Energy" is inspired by the French word "soleil," meaning "sun," with a unique twist to create a fresh, modern identity. Combined with "Energy," it reflects our mission to harness the power of the sun to deliver sustainable, accessible energy solutions. Born out of a passion for renewable energy and technology, this project aims to address real-world challenges through the GDSC Solution Challenge framework.

Here’s an updated version of your README for "Solaiel Energy," incorporating details about the first module, the Solar Panel Suggestion Tool. I’ll also suggest a refined name for the module that better reflects its comprehensive functionality—predicting solar panel wattage, number of plates, battery size, inverter wattage, and overall system price based on user inputs (roof size, panel type, and daily house wattage). The update keeps it concise, professional, and aligned with your GDSC Solution Challenge 2025 project.

## Solar System Planner (Module 1)
The first module, **Solar System Planner**, is the core feature of Solaiel Energy. It predicts and designs a complete solar solution tailored to user inputs, providing system specifications and cost estimates to simplify solar adoption.

### Functionality
- **Purpose**: Recommends an optimal solar system, including panel wattage, number of plates, battery capacity, inverter wattage, and total price.  
- **User Inputs**:  
  - **Roof Size**: Available area in square feet (e.g., 500 sq. ft.) to determine panel capacity.  
  - **Panel Type**: Choice of monocrystalline (high efficiency, costly), polycrystalline (cost-effective), or others.  
  - **Daily House Wattage**: Energy needs in kWh/day (e.g., 15 kWh), calculated from device usage (lights, fans, fridge, etc.).  
- **Outputs**:  
  - **Panel Wattage**: Total system size (e.g., 3.2 kW).  
  - **Number of Plates**: Panels required (e.g., 6 Longi 550W panels for 3.3 kW).  
  - **Battery Capacity**: Storage in kWh (e.g., 7.2 kWh for 6-hour backup).  
  - **Inverter Wattage**: Power conversion capacity (e.g., 4 kW inverter).  
  - **Total Price**: Estimated cost in PKR (e.g., ~PKR 297,000), factoring panel type and local rates.  
- **Example**: Input: 500 sq. ft., monocrystalline, 15 kWh/day → Output: “3.3 kW system (6 Longi 550W panels), 7.2 kWh battery, 4 kW inverter, ~PKR 297,000.”

### Implementation
- **Technologies**:  
  - **Flutter**: Cross-platform UI for app and web, displaying inputs and results.  
  - **Firebase**: Firestore stores panel options (e.g., name, watts, price, type); Cloud Functions for rule-based calculations.  
  - **TensorFlow Lite**: AI predicts kWh and price based on inputs, enhancing accuracy.  
- **Process**:  
  1. User enters roof size, panel type, and device usage via Flutter form.  
  2. TensorFlow Lite predicts daily kWh (e.g., 15 kWh) from usage data.  
  3. System size (kW) calculated: `kW = kWh / (5.3 * 0.9)` (Pakistan’s irradiance, 90% efficiency).  
  4. Number of plates: `ceil(kW * 1000 / panel_watts)` (e.g., 3.3 kW / 550W = 6 panels).  
  5. Battery: `kWh * backup_hours / depth_of_discharge` (e.g., 15 * 6 / 0.8 = 7.2 kWh).  
  6. Inverter: Slightly above kW (e.g., 4 kW for 3.3 kW system).  
  7. Price: `panels * price_per_panel + battery_cost + inverter_cost` from Firestore.  
  8. Results displayed, filtered by user location (e.g., Lahore vendors).

---
