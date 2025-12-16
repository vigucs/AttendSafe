export interface CalculationResult {
    currentPercent: number;
    canSkip: number; // Number of classes one can miss safely
    classesToRecover: number; // Number of consecutive classes needed to attend
    status: 'safe' | 'warning' | 'critical';
    dropAfterMiss: number | null; // Predicted % after missing 1 class
}

export const executeCalculations = (
    attended: number,
    total: number,
    minPercent: number
): CalculationResult => {
    // Prevent division by zero
    if (total === 0) {
        return {
            currentPercent: 100,
            canSkip: 0,
            classesToRecover: 0,
            status: 'safe',
            dropAfterMiss: 0,
        };
    }

    const currentPercent = (attended / total) * 100;
    const minFraction = minPercent / 100;

    // Status logic
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (currentPercent < minPercent) {
        status = 'critical';
    } else if (currentPercent < minPercent + 5) {
        // Arbitrary warning buffer of 5%
        status = 'warning';
    }

    // Calculate "Can Skip" (Safety Margin)
    // Formula: (attended) / (total + x) >= minFraction
    // attended >= minFraction * (total + x)
    // attended / minFraction >= total + x
    // x <= (attended / minFraction) - total
    let canSkip = 0;
    if (currentPercent >= minPercent) {
        const maxTotal = attended / minFraction;
        canSkip = Math.floor(maxTotal - total);
    }

    // Calculate "Recovery Needed"
    // Formula: (attended + x) / (total + x) >= minFraction
    // attended + x >= minFraction * total + minFraction * x
    // x - minFraction * x >= minFraction * total - attended
    // x * (1 - minFraction) >= minFraction * total - attended
    // x >= (minFraction * total - attended) / (1 - minFraction)
    let classesToRecover = 0;
    if (currentPercent < minPercent) {
        // Avoid division by zero if minPercent is 100% (though improbable for recovery if already below)
        if (minFraction >= 1) {
            // If min is 100% and we missed one, we can never reach 100% again mathematically if counting total history.
            // But practically, user might want to know for 'next' classes. 
            // For strict historical calc, it's impossible.
            classesToRecover = Infinity;
        } else {
            const numerator = minFraction * total - attended;
            const denominator = 1 - minFraction;
            classesToRecover = Math.ceil(numerator / denominator);
        }
    }

    // Drop after missing next class
    const dropAfterMiss = (attended / (total + 1)) * 100;

    return {
        currentPercent: parseFloat(currentPercent.toFixed(2)),
        canSkip,
        classesToRecover,
        status,
        dropAfterMiss: parseFloat(dropAfterMiss.toFixed(2)),
    };
};

export const simulateFuture = (
    attended: number,
    total: number,
    attendNext: number,
    missNext: number
) => {
    const newAttended = attended + attendNext;
    const newTotal = total + attendNext + missNext;

    if (newTotal === 0) return 100;

    return parseFloat(((newAttended / newTotal) * 100).toFixed(2));
};
