import type { NumberAnswerCategory } from '$lib/types/guess';

export const yearCategory = {
	name: 'year',
	proximityStep: 5,
	getProximity: (todaysValue: number, guessedValue: number) => {
		const diff = Math.abs(todaysValue - guessedValue);
		if (diff === 0) return undefined;
		if (diff <= 5) return 'very-close';
		if (diff <= 10) return 'close';
		return 'far';
	},
	getHint: (todaysValue: number, guessedValue: number) => {
		if (todaysValue === guessedValue) return undefined;
		if (todaysValue > guessedValue) return 'above';
		return 'below';
	},
	getAboveText: (category: NumberAnswerCategory) => {
		if (category.proximity === 'close') {
			return `Released later, but within 5 years`;
		}
		return `Released later`;
	},
	getBelowText: (category: NumberAnswerCategory) => {
		if (category.proximity === 'close') {
			return `Released earlier, but within 5 years`;
		}
		return `Released earlier`;
	}
};

export const runtimeCategory = {
	name: 'runtime',
	proximityStep: 10,
	getProximity: (todaysValue: number, guessedValue: number) => {
		const diff = Math.abs(todaysValue - guessedValue);
		if (diff === 0) return undefined;
		if (diff <= 10) return 'very-close';
		if (diff <= 20) return 'close';
		return 'far';
	},
	getHint: (todaysValue: number, guessedValue: number) => {
		if (todaysValue === guessedValue) return undefined;
		if (todaysValue > guessedValue) return 'above';
		return 'below';
	},
	getAboveText: (category: NumberAnswerCategory) => {
    if (category.proximity === 'close') {
      return `Runtime is longer, but within 10 minutes`;
		}
    return `Runtime is longer`;
	},
	getBelowText: (category: NumberAnswerCategory) => {
    if (category.proximity === 'close') {
      return `Runtime is shorter, but within 10 minutes`;
		}
    return `Runtime is shorter`;
	}
};

export const ratingCategory = {
	name: 'rating',
	proximityStep: 0.5,
	getProximity: (todaysValue: number, guessedValue: number) => {
		const diff = Math.abs(todaysValue - guessedValue);
		if (diff === 0) return undefined;
		if (diff <= 0.5) return 'very-close';
		if (diff <= 1) return 'close';
		return 'far';
	},
	getHint: (todaysValue: number, guessedValue: number) => {
		if (todaysValue === guessedValue) return undefined;
		if (todaysValue > guessedValue) return 'above';
		return 'below';
	},
	getAboveText: (category: NumberAnswerCategory) => {
    if (category.proximity === 'close') {
      return `Rating is higher, but within 0.5 points`;
		}
    return `Rating is higher`;
	},
	getBelowText: (category: NumberAnswerCategory) => {
    if (category.proximity === 'close') {
      return `Rating is lower, but within 0.5 points`;
    }
    return `Runtime is lower`;
	}
};

export const categories = {
	year: yearCategory,
	runtime: runtimeCategory,
	rating: ratingCategory
} as const;
