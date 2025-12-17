export interface CalculationResult {
    currentPercent: number;
    canSkip: number; // Number of classes one can miss based on Semester Total
    classesToRecover: number; // Number of consecutive classes needed to attend
    status: 'safe' | 'warning' | 'critical';
    dropAfterMiss: number | null; // Predicted % after missing 1 class
}

export const executeCalculations = (
    attended: number,
    held: number,
    minPercent: number,
    semesterTotal: number = 0
): CalculationResult => {
    // Prevent division by zero
    if (held === 0) {
        return {
            currentPercent: 100,
            canSkip: 0,
            classesToRecover: 0,
            status: 'safe',
            dropAfterMiss: 0,
        };
    }

    const currentPercent = (attended / held) * 100;
    const minFraction = minPercent / 100;

    // Status logic (based on CURRENT progress)
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (currentPercent < minPercent) {
        status = 'critical';
    } else if (currentPercent < minPercent + 5) {
        status = 'warning';
    }

    // "Can Skip" Logic
    let canSkip = 0;

    if (semesterTotal > 0 && semesterTotal >= held) {
        // Calculation based on FIXED SEMESTER TOTAL
        // Total allowable misses = floor(SemesterTotal * (1 - minFraction))
        // Actual misses = Held - Attended
        // Remaining Allowable Misses = Total Allowable Misses - Actual Misses
        const totalAllowableMisses = Math.floor(semesterTotal * (1 - minFraction));
        const actualMisses = held - attended;
        canSkip = Math.max(0, totalAllowableMisses - actualMisses);
    } else {
        // Fallback: Infinite Horizon (Current logic)
        // If I am safely above target, how many consecutive classes can I miss and stay above?
        // (attended) / (held + x) >= minFraction
        if (currentPercent >= minPercent) {
            const maxHeld = attended / minFraction;
            canSkip = Math.floor(maxHeld - held);
        }
    }

    // "Recovery Needed" Logic (Short term recovery to get back to Green)
    // Formula: (attended + x) / (held + x) >= minFraction
    let classesToRecover = 0;
    if (currentPercent < minPercent) {
        if (minFraction >= 1) {
            classesToRecover = Infinity;
        } else {
            const numerator = minFraction * held - attended;
            const denominator = 1 - minFraction;
            classesToRecover = Math.ceil(numerator / denominator);
        }
    }

    // Drop after missing next class
    const dropAfterMiss = (attended / (held + 1)) * 100;

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
