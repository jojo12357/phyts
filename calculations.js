// calculations.js - Physics calculations and formulas
const PhysicsCalculations = {
    // Uniform motion calculations
    uniformMotion(v0, t, a) {
        const s = v0 * t + 0.5 * a * t * t;
        const v = v0 + a * t;
        return { distance: s, finalVelocity: v };
    },

    // Projectile motion calculations
    projectileMotion(v0, angle, gravity) {
        const rad = angle * Math.PI / 180;
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);
        
        const timeOfFlight = (2 * vy) / gravity;
        const range = vx * timeOfFlight;
        const maxHeight = (vy * vy) / (2 * gravity);
        
        return {
            horizontalVelocity: vx,
            verticalVelocity: vy,
            timeOfFlight: timeOfFlight,
            range: range,
            maxHeight: maxHeight
        };
    },

    // Pendulum calculations
    pendulumGravity(length, period) {
        return (4 * Math.PI * Math.PI * length) / (period * period);
    },

    // Wave speed calculations
    waveSpeed(wavelength, frequency) {
        return wavelength * frequency;
    },

    // Error calculations
    calculateErrors(measurements) {
        if (measurements.length === 0) return null;
        
        const sum = measurements.reduce((a, b) => a + b, 0);
        const average = sum / measurements.length;
        
        // Absolute error (average of absolute deviations)
        const absoluteErrors = measurements.map(m => Math.abs(m - average));
        const avgAbsoluteError = absoluteErrors.reduce((a, b) => a + b, 0) / absoluteErrors.length;
        
        // Relative error (as percentage)
        const relativeError = (avgAbsoluteError / average) * 100;
        
        return {
            average: average,
            absoluteError: avgAbsoluteError,
            relativeError: relativeError,
            finalResult: average
        };
    },

    // Generate measurement values based on laboratory type
    generateMeasurement(labType, parameters) {
        const baseValue = this.calculateBaseValue(labType, parameters);
        // Add some realistic variation (±5%)
        const variation = (Math.random() - 0.5) * 0.1 * baseValue;
        return baseValue + variation;
    },

    calculateBaseValue(labType, params) {
        switch (labType) {
            case 'uniform':
                const uniformResult = this.uniformMotion(params.v0, params.time, params.accel);
                return uniformResult.distance;
                
            case 'projectile':
                const projectileResult = this.projectileMotion(params.v0, params.angle, params.gravity);
                return projectileResult.range;
                
            case 'pendulum':
                return this.pendulumGravity(params.length, params.period);
                
            case 'wave':
                return this.waveSpeed(params.wavelength, params.frequency);
                
            default:
                return 0;
        }
    }
};
