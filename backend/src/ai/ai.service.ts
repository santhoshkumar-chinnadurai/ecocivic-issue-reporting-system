import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
    async analyzeImage(imageUrl: string): Promise<{ valid: boolean; category: string; confidence: number }> {
        // Mock AI Analysis
        console.log(`[AI SERVICE] Analyzing image: ${imageUrl}`);
        await new Promise(r => setTimeout(r, 500));
        const isPothole = Math.random() > 0.3;
        return {
            valid: true,
            category: isPothole ? 'POTHOLE' : 'GARBAGE',
            confidence: 0.85 + (Math.random() * 0.1),
        };
    }

    async categorizeComplaint(description: string, category: string): Promise<{ category: string; priority: string; confidence: number }> {
        console.log(`[AI SERVICE] Categorizing complaint...`);
        await new Promise(r => setTimeout(r, 300)); // Simulate AI delay

        const text = `${category} ${description}`.toLowerCase();
        let detectedCategory = 'OTHER';
        let priority = 'MEDIUM';
        let confidence = 0.5;

        // Mock Smart NLP rules
        if (text.includes('pothole') || text.includes('road') || text.includes('crack')) {
            detectedCategory = 'POTHOLE';
            priority = 'HIGH';
            confidence = 0.92;
        } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste')) {
            detectedCategory = 'GARBAGE';
            priority = 'MEDIUM';
            confidence = 0.88;
        } else if (text.includes('light') || text.includes('dark')) {
            detectedCategory = 'STREET_LIGHT';
            priority = 'LOW';
            confidence = 0.85;
        } else if (text.includes('water') || text.includes('leak') || text.includes('pipe')) {
            detectedCategory = 'WATER_LEAK';
            priority = 'HIGH';
            confidence = 0.90;
        } else if (text.includes('traffic') || text.includes('signal') || text.includes('accident')) {
            detectedCategory = 'TRAFFIC_SIGNAL';
            priority = 'CRITICAL';
            confidence = 0.95;
        }

        return { category: detectedCategory, priority, confidence };
    }
}
