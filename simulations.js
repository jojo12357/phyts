// simulations.js - Physics simulations for each laboratory
const Simulations = {
    canvases: {},

    init() {
        this.setupCanvases();
        this.setupUniformSimulation();
        this.setupProjectileSimulation();
        this.setupPendulumSimulation();
        this.setupWaveSimulation();
    },

    setupCanvases() {
        // Initialize all canvases
        const canvasIds = ['uniformCanvas', 'projectileCanvas', 'pendulumCanvas', 'waveCanvas'];
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                this.canvases[id] = canvas.getContext('2d');
                this.resizeCanvas(canvas);
            }
        });
        
        // Resize canvases on window resize
        window.addEventListener('resize', () => {
            Object.keys(this.canvases).forEach(id => {
                const canvas = document.getElementById(id);
                if (canvas) this.resizeCanvas(canvas);
            });
        });
    },

    resizeCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    },

    setupUniformSimulation() {
        const canvas = document.getElementById('uniformCanvas');
        if (!canvas) return;
        
        const runButton = document.querySelector('[data-lab="uniform"].btn-run');
        if (runButton) {
            runButton.addEventListener('click', () => {
                this.runUniformSimulation();
            });
        }
    },

    runUniformSimulation() {
        const canvas = document.getElementById('uniformCanvas');
        const ctx = this.canvases['uniformCanvas'];
        
        // Get input values
        const v0 = parseFloat(document.getElementById('uniform-v0').value);
        const time = parseFloat(document.getElementById('uniform-time').value);
        const accel = parseFloat(document.getElementById('uniform-accel').value);
        
        // Update state
        PHYSLAB.state.labs.uniform.v0 = v0;
        PHYSLAB.state.labs.uniform.time = time;
        PHYSLAB.state.labs.uniform.accel = accel;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();
        
        // Simulation parameters
        const scale = 10; // pixels per meter
        const startX = 50;
        const startY = canvas.height - 20;
        
        // Calculate positions
        const positions = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * time;
            const s = v0 * t + 0.5 * accel * t * t;
            positions.push({
                x: startX + s * scale,
                y: startY,
                t: t
            });
        }
        
        // Draw trajectory
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        positions.forEach((pos, index) => {
            if (index === 0) {
                ctx.moveTo(pos.x, pos.y);
            } else {
                ctx.lineTo(pos.x, pos.y);
            }
        });
        ctx.stroke();
        
        // Draw moving object
        const lastPos = positions[positions.length - 1];
        ctx.fillStyle = '#ff006e';
        ctx.beginPath();
        ctx.arc(lastPos.x, lastPos.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw velocity vector
        const finalVelocity = v0 + accel * time;
        const velocityScale = 2;
        ctx.strokeStyle = '#8338ec';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(lastPos.x + finalVelocity * velocityScale, lastPos.y);
        ctx.stroke();
        
        // Draw arrowhead
        ctx.fillStyle = '#8338ec';
        ctx.beginPath();
        ctx.moveTo(lastPos.x + finalVelocity * velocityScale, lastPos.y);
        ctx.lineTo(lastPos.x + finalVelocity * velocityScale - 10, lastPos.y - 5);
        ctx.lineTo(lastPos.x + finalVelocity * velocityScale - 10, lastPos.y + 5);
        ctx.closePath();
        ctx.fill();
        
        // Display results
        this.displayResults('uniform', {
            'Жолдың узындығы': (v0 * time + 0.5 * accel * time * time).toFixed(2) + ' м',
            'Соңғы жылдамдық': finalVelocity.toFixed(2) + ' м/с'
        });
    },

    setupProjectileSimulation() {
        const canvas = document.getElementById('projectileCanvas');
        if (!canvas) return;
        
        const runButton = document.querySelector('[data-lab="projectile"].btn-run');
        if (runButton) {
            runButton.addEventListener('click', () => {
                this.runProjectileSimulation();
            });
        }
    },

    runProjectileSimulation() {
        const canvas = document.getElementById('projectileCanvas');
        const ctx = this.canvases['projectileCanvas'];
        
        // Get input values
        const v0 = parseFloat(document.getElementById('proj-v0').value);
        const angle = parseFloat(document.getElementById('proj-angle').value);
        const gravity = parseFloat(document.getElementById('proj-gravity').value);
        
        // Update state
        PHYSLAB.state.labs.projectile.v0 = v0;
        PHYSLAB.state.labs.projectile.angle = angle;
        PHYSLAB.state.labs.projectile.gravity = gravity;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();
        
        // Calculate physics
        const rad = angle * Math.PI / 180;
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);
        const timeOfFlight = (2 * vy) / gravity;
        const range = vx * timeOfFlight;
        
        const scale = 5; // pixels per meter
        const startX = 50;
        const startY = canvas.height - 20;
        
        // Generate trajectory points
        const points = [];
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * timeOfFlight;
            const x = startX + vx * t * scale;
            const y = startY - (vy * t - 0.5 * gravity * t * t) * scale;
            points.push({ x, y, t });
        }
        
        // Draw trajectory
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
        
        // Draw projectile at final position
        const lastPoint = points[points.length - 1];
        ctx.fillStyle = '#ff006e';
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Display results
        this.displayResults('projectile', {
            'Қашықтық': range.toFixed(2) + ' м',
            'Уақыт': timeOfFlight.toFixed(2) + ' с',
            'Максималды биіктік': (vy * vy / (2 * gravity)).toFixed(2) + ' м'
        });
    },

    setupPendulumSimulation() {
        const canvas = document.getElementById('pendulumCanvas');
        if (!canvas) return;
        
        const runButton = document.querySelector('[data-lab="pendulum"].btn-run');
        if (runButton) {
            runButton.addEventListener('click', () => {
                this.runPendulumSimulation();
            });
        }
    },

    runPendulumSimulation() {
        const canvas = document.getElementById('pendulumCanvas');
        const ctx = this.canvases['pendulumCanvas'];
        
        // Get input values
        const length = parseFloat(document.getElementById('pend-length').value);
        const period = parseFloat(document.getElementById('pend-period').value);
        
        // Update state
        PHYSLAB.state.labs.pendulum.length = length;
        PHYSLAB.state.labs.pendulum.period = period;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate gravity
        const g = (4 * Math.PI * Math.PI * length) / (period * period);
        
        // Draw pendulum
        const pivotX = canvas.width / 2;
        const pivotY = 50;
        const scale = 50; // pixels per meter
        const angle = Math.PI / 4; // 45 degrees
        
        const bobX = pivotX + Math.sin(angle) * length * scale;
        const bobY = pivotY + Math.cos(angle) * length * scale;
        
        // Draw pivot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw string
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();
        
        // Draw bob
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw arc indicating motion
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, length * scale, -angle, angle);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Display results
        this.displayResults('pendulum', {
            'Тербеліс уақыты': period.toFixed(2) + ' с',
            'Тыныштық күші (g)': g.toFixed(2) + ' м/с²'
        });
    },

    setupWaveSimulation() {
        const canvas = document.getElementById('waveCanvas');
        if (!canvas) return;
        
        const runButton = document.querySelector('[data-lab="wave"].btn-run');
        if (runButton) {
            runButton.addEventListener('click', () => {
                this.runWaveSimulation();
            });
        }
    },

    runWaveSimulation() {
        const canvas = document.getElementById('waveCanvas');
        const ctx = this.canvases['waveCanvas'];
        
        // Get input values
        const wavelength = parseFloat(document.getElementById('wave-wavelength').value);
        const frequency = parseFloat(document.getElementById('wave-frequency').value);
        
        // Update state
        PHYSLAB.state.labs.wave.wavelength = wavelength;
        PHYSLAB.state.labs.wave.frequency = frequency;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate wave properties
        const speed = wavelength * frequency;
        const period = 1 / frequency;
        const k = (2 * Math.PI) / wavelength;
        const omega = 2 * Math.PI * frequency;
        
        // Draw wave
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const amplitude = 30;
        const startY = canvas.height / 2;
        
        for (let x = 0; x <= canvas.width; x++) {
            const y = startY + amplitude * Math.sin(k * x - omega * Date.now() / 1000);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw wavelength indicator
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(50, startY + amplitude + 10);
        ctx.lineTo(50 + wavelength * 20, startY + amplitude + 10);
        ctx.stroke();
        
        // Draw wavelength label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Exo 2';
        ctx.fillText(`λ = ${wavelength} м`, 60, startY + amplitude + 25);
        ctx.setLineDash([]);
        
        // Display results
        this.displayResults('wave', {
            'Толқын жылдамдығы': speed.toFixed(2) + ' м/с',
            'Период': period.toFixed(3) + ' с',
            'Толқын саны': frequency.toFixed(2) + ' Гц'
        });
    },

    displayResults(labType, results) {
        // Create or update results display
        let resultsDiv = document.getElementById(`${labType}-results`);
        if (!resultsDiv) {
            resultsDiv = document.createElement('div');
            resultsDiv.id = `${labType}-results`;
            resultsDiv.className = 'lab-results';
            
            // Find the lab card and append results
            const labCard = document.querySelector(`[data-lab="${labType}"]`);
            if (labCard) {
                labCard.appendChild(resultsDiv);
            }
        }
        
        let resultsHTML = '<h4>Есептеу нәтижелері:</h4><div class="results-list">';
        Object.entries(results).forEach(([key, value]) => {
            resultsHTML += `<div class="result-item"><span>${key}:</span><span>${value}</span></div>`;
        });
        resultsHTML += '</div>';
        
        resultsDiv.innerHTML = resultsHTML;
    },

    // Measurement functionality
    addMeasurement(labType) {
        const labState = PHYSLAB.state.labs[labType];
        if (!labState) return;
        
        // Generate measurement based on current parameters
        const measurement = PhysicsCalculations.generateMeasurement(labType, labState);
        labState.measurements.push(measurement);
        
        // Keep only last 5 measurements
        if (labState.measurements.length > 5) {
            labState.measurements.shift();
        }
        
        this.updateMeasurementDisplay(labType);
    },

    updateMeasurementDisplay(labType) {
        const labState = PHYSLAB.state.labs[labType];
        const measurementBody = document.getElementById('measurementBody');
        if (!measurementBody) return;
        
        // Clear previous measurements
        measurementBody.innerHTML = '';
        
        // Add measurement rows
        labState.measurements.forEach((measurement, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Өлшеу ${index + 1}</td>
                <td>${measurement.toFixed(3)}</td>
                <td>${this.getUnit(labType)}</td>
            `;
            measurementBody.appendChild(row);
        });
        
        // Calculate and display errors
        if (labState.measurements.length > 0) {
            const errors = PhysicsCalculations.calculateErrors(labState.measurements);
            
            document.getElementById('averageValue').textContent = errors.average.toFixed(3);
            document.getElementById('absError').textContent = errors.absoluteError.toFixed(3);
            document.getElementById('relError').textContent = errors.relativeError.toFixed(2) + '%';
            document.getElementById('finalResult').textContent = errors.finalResult.toFixed(3);
        }
    },

    getUnit(labType) {
        const units = {
            uniform: 'м',
            projectile: 'м',
            pendulum: 'м/с²',
            wave: 'м/с'
        };
        return units[labType] || '';
    },

    // Open measurement modal
    openMeasurementModal(labType) {
        const modal = document.getElementById('measurementModal');
        const title = document.getElementById('measurementTitle');
        
        title.textContent = `${this.getLabName(labType)} - Өлшеу мәндері`;
        
        // Reset measurements if needed
        PHYSLAB.state.labs[labType].measurements = [];
        this.updateMeasurementDisplay(labType);
        
        PHYSLAB.openModal('measurementModal');
    },

    getLabName(labType) {
        const names = {
            uniform: 'Теңүдемелі қозғалыс',
            projectile: 'Горизонталь лақтырылған дене',
            pendulum: 'Маятникпен g анықтау',
            wave: 'Беттік толқын жылдамдығын анықтау'
        };
        return names[labType] || labType;
    }
};

// Initialize simulations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Simulations.init();
});
