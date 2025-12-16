import { describe, it, expect } from 'vitest';
import { executeCalculations, simulateFuture } from './calculationEngine';

describe('Attendance Calculation Engine', () => {

    describe('executeCalculations', () => {
        it('should calculate safe status correctly', () => {
            // Attended 35/40 = 87.5% (Min 75%)
            const result = executeCalculations(35, 40, 75);
            expect(result.currentPercent).toBe(87.5);
            expect(result.status).toBe('safe');
        });

        it('should calculate warning status correctly', () => {
            // Attended 31/40 = 77.5% (Min 75%) - within 5% buffer
            const result = executeCalculations(31, 40, 75);
            expect(result.currentPercent).toBe(77.5);
            expect(result.status).toBe('warning');
        });

        it('should calculate critical status correctly', () => {
            // Attended 29/40 = 72.5% (Min 75%)
            const result = executeCalculations(29, 40, 75);
            expect(result.currentPercent).toBe(72.5);
            expect(result.status).toBe('critical');
        });

        it('should calculate canSkip correctly', () => {
            // Attended 32/40 = 80%. Min 75%.
            // 32 / (40 + x) >= 0.75 => x <= 2.66 => 2 classes
            const result = executeCalculations(32, 40, 75);
            expect(result.canSkip).toBe(2);

            // Verify: 32/42 = 76.19% (Safe), 32/43 = 74.4% (Unsafe)
        });

        it('should calculate classesToRecover correctly', () => {
            // Attended 29/40 = 72.5%. Min 75%.
            // Needed: 30 required for 40 (failed). 
            // (29+x)/(40+x) >= 0.75
            // 29+x >= 30 + 0.75x
            // 0.25x >= 1 => x >= 4
            const result = executeCalculations(29, 40, 75);
            expect(result.classesToRecover).toBe(4);

            // Verify: (29+4)/(40+4) = 33/44 = 75%
        });

        it('should handle division by zero (new subject)', () => {
            const result = executeCalculations(0, 0, 75);
            expect(result.currentPercent).toBe(100);
            expect(result.status).toBe('safe');
        });

        it('should handle 100% attendance', () => {
            const result = executeCalculations(10, 10, 75);
            expect(result.currentPercent).toBe(100);
            // Can miss: 10/x >= 0.75 => x <= 13.33 total => can add 3.33 => 3 misses
            // Wait, 10 / (10+x) >= 0.75
            // 10 >= 7.5 + 0.75x
            // 2.5 >= 0.75x
            // x <= 3.33 => 3
            expect(result.canSkip).toBe(3);
        });
    });

    describe('simulateFuture', () => {
        it('should calculate future percentage accurately', () => {
            // 30/40 (75%). Attend next 5.
            // 35/45 = 77.78%
            const result = simulateFuture(30, 40, 5, 0);
            expect(result).toBe(77.78);
        });

        it('should calculate future drop with misses', () => {
            // 30/40 (75%). Miss next 5.
            // 30/45 = 66.67%
            const result = simulateFuture(30, 40, 0, 5);
            expect(result).toBe(66.67);
        });
    });

});
