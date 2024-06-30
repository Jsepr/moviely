import type { NumberAnswerCategory } from "$lib/types/guess";
import { formatNumberCategoryValue } from "../utils";

export function getNumberCategoryHoverText(category: NumberAnswerCategory) {
	if (category.correct) return undefined;
	const { hint } = category;
	const formattedValue = formatNumberCategoryValue(category);
	switch (hint) {
		case 'above':
			return `The movie's release year is within 5 years later than your guess of ${formattedValue}`;
		case 'below':
			return `The movie's release year is within 5 years earlier than your guess of ${formattedValue}`;
		default:
			return undefined;
	}
}
