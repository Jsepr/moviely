import { getApiClient } from '$lib/apiClient.js';
import { parse } from 'date-fns';
import type { AnswerCategory, Guess } from '$lib/types/guess.js';
import type { DetailsResponse } from '$lib/types/movie.js';
import { getNumberAnswerCategory } from './utils.js';
import clm from 'country-locale-map';
import { todaysMovie } from '$lib/todaysMovie.js';
import { baseImageUrl } from '$lib/constants.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, url }) {
	const apiClient = getApiClient(fetch);
	const guessId = url.searchParams.get('guessId');

	if (!guessId)
		return new Response(JSON.stringify({ message: 'guessId is required' }), { status: 400 });

	try {
		const res = await apiClient(`movie/${guessId}?append_to_response=credits`);
		if (!res.ok) {
			return new Response(JSON.stringify({ message: 'something went wrong' }), { status: 500 });
		}
		const guessedMovie = (await res.json()) as DetailsResponse;

		const todaysGenreIds = todaysMovie.genres.map((g) => g.id).sort();
		const genres = guessedMovie.genres.map((g) => ({
			...g,
			correct: todaysGenreIds.includes(g.id)
		}));
		const genreIds = genres.map((g) => g.id).sort();

		const todaysDirectorIds = todaysMovie.credits.crew
			.filter((d) => d.job.toLowerCase() === 'director')
			.map((d) => d.id)
			.sort();
		const directors = guessedMovie.credits.crew
			.filter((d) => d.job.toLowerCase() === 'director')
			.map((d) => ({ id: d.id, name: d.name, correct: todaysDirectorIds.includes(d.id) }));
		const directorIds = directors.map((d) => d.id).sort();

		const todaysActors = todaysMovie.credits.cast.filter(
			(d) => d.known_for_department.toLowerCase() === 'acting'
		);
		const todaysActorIds = todaysActors.map((d) => d.id);
		const actors = guessedMovie.credits.cast
			.filter((a) => a.known_for_department.toLowerCase() === 'acting' && a.order < 5)
			.map((a) => ({ id: a.id, name: a.name, correct: todaysActorIds.includes(a.id) }));
		const actorIds = actors.map((d) => d.id).sort();
		const countries = guessedMovie.origin_country.map((c) => {
			const todaysContinents = todaysMovie.origin_country.map(
				(c) => clm.getCountryByAlpha2(c)?.continent
			);
			const country = clm.getCountryByAlpha2(c);
			return {
				name: country?.name,
				value: c,
				correct: todaysMovie.origin_country?.includes(c),
				sameContinent: todaysContinents.includes(country?.continent)
			};
		});

		const yearCategory =
			todaysMovie.release_date && guessedMovie.release_date
				? getNumberAnswerCategory({
						name: 'year',
						todaysValue: parse(todaysMovie.release_date, 'yyyy-MM-dd', new Date()).getFullYear(),
						guessedValue: parse(guessedMovie.release_date, 'yyyy-MM-dd', new Date()).getFullYear(),
						closeDiff: 5
					})
				: null;

		const categories: AnswerCategory[] = [
			...(yearCategory ? [yearCategory] : []),
			getNumberAnswerCategory({
				name: 'runtime',
				todaysValue: todaysMovie.runtime,
				guessedValue: guessedMovie.runtime,
				closeDiff: 10
			}),
			getNumberAnswerCategory({
				name: 'rating',
				todaysValue:
					todaysMovie.id === guessedMovie.id ? guessedMovie.vote_average : todaysMovie.vote_average,
				guessedValue: guessedMovie.vote_average,
				closeDiff: 1
			}),
			{
				name: 'countries' as const,
				value: countries,
				correct:
					JSON.stringify(todaysMovie.origin_country) === JSON.stringify(guessedMovie.origin_country)
			},
			{
				name: 'genres',
				value: genres,
				correct: JSON.stringify(todaysGenreIds) === JSON.stringify(genreIds)
			},
			{
				name: 'directors',
				value: directors,
				correct: JSON.stringify(todaysDirectorIds) === JSON.stringify(directorIds)
			},
			{
				name: 'actors',
				value: actors,
				correct:
					JSON.stringify(
						todaysActors
							.filter((a) => a.order < 5)
							.map((a) => a.id)
							.sort()
					) === JSON.stringify(actorIds)
			}
		];

		const guess: Guess = {
			id: guessId,
			title: guessedMovie.title,
			posterSrc: `${baseImageUrl}w154${guessedMovie.poster_path}`,
			correct: guessedMovie.id === todaysMovie.id,
			categories
		};
		return new Response(JSON.stringify(guess));
	} catch (error) {
		return new Response(JSON.stringify({ message: 'something went wrong', error }), {
			status: 500
		});
	}
}
