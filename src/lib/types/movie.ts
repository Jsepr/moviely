export interface SearchMovie {
	id: number;
	title: string;
	genre_ids: number[];
	popularity: number;
	poster_path: string;
	release_date: string;
}

export interface SearchMovieResponse {
	page: number;
	results: SearchMovie[];
}

export interface MovielySearchMovie {
	id: number;
	title: string;
	posterPath: string | null;
}

interface CreditPerson {
	id: number;
	job: string;
	known_for_department: string;
	name: string;
	order: number;
}

export interface DetailsResponse {
	id: number;
	title: string;
	budget: number;
	origin_country: string[];
	genres: { id: number; name: string }[];
	popularity: number;
	poster_path: string;
	production_countries: { name: string }[];
	runtime: number;
	revenue: number;
	release_date?: string;
	status: string;
	tagline?: string;
	credits: {
		cast: CreditPerson[];
		crew: CreditPerson[];
	};
	vote_average: number;
}

export interface Cast {
	id: number;
	name: string;
}

export interface Crew {
	id: number;
	name: string;
}

export interface CreditsResponse {
	id: number;
	cast: Array<Cast>;
	crew: Array<Crew>;
}

export interface GenresResponse {
	genres: { id: number; name: string }[];
}
