export interface NumberCategory<TName extends string> {
	name: TName;
	value: number;
	correct: boolean;
	hint?: 'above' | 'below';
	proximity?: 'close' | 'far';
}

interface MultiStringValue {
	id: number;
	name: string;
	correct: boolean;

	value?: never;
	sameContinent?: never;
}

export interface MultiStringCategory<TName extends string> {
	name: TName;
	value: MultiStringValue[];
	correct: boolean;

	hint?: never;
	proximity?: never;
}

export interface CountryValue {
	id?: never;

	name?: string;
	value: string;
	correct: boolean;
	sameContinent?: boolean;
}

export interface CountriesCategory {
	name: 'countries';
	value: CountryValue[];
	correct: boolean;

	hint?: never;
	proximity?: never;
}

export type NumberAnswerCategory =
	| NumberCategory<'year'>
	| NumberCategory<'runtime'>
	| NumberCategory<'rating'>;
export type MultiStringAnswerCategory =
	| MultiStringCategory<'genres'>
	| MultiStringCategory<'directors'>
	| MultiStringCategory<'actors'>;

export type AnswerCategory = NumberAnswerCategory | MultiStringAnswerCategory | CountriesCategory;

export interface Hint {
	id: string;
	type: 'tagline' | 'quote' | 'image';
	value: string;

	loading?: never;
}
export interface Guess {
	id: string;
	title: string;
	posterSrc: string | null;
	correct: boolean;
	categories: AnswerCategory[];

	loading?: never;
	type?: never;
}

export interface LoadingGuess {
	id: string;
	title: string;
	posterSrc: string | null;

	loading: boolean;

	type?: never;
}

export interface GuessResponse {
	hint?: Hint;
	guess: Guess;
	correctMovie: Guess;
}

export function isYearCategory(category: AnswerCategory): category is NumberCategory<'year'> {
	return typeof category.value === 'number';
}

export function isMultiStringCategory(
	category: AnswerCategory
): category is MultiStringAnswerCategory {
	return Array.isArray(category.value);
}

export function isCountriesCategory(category: AnswerCategory): category is CountriesCategory {
	return category.name === 'countries';
}

export function isGuess(guessOrHint: Guess | LoadingGuess | Hint): guessOrHint is Guess {
	return !guessOrHint.type && !guessOrHint.loading;
}

export function isLoadingGuess(
	guessOrHint: Guess | LoadingGuess | Hint
): guessOrHint is LoadingGuess {
	return !!guessOrHint.loading;
}

export function isHint(guessOrHint: Guess | LoadingGuess | Hint): guessOrHint is Hint {
	return !!guessOrHint.type;
}
