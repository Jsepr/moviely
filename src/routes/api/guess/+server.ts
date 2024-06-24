import { getApiClient } from '$lib/apiClient.js';
import type { DetailsResponse } from '$lib/types/movie.js';
import { getGuess, getHint } from './utils.js';
import { getMovieForDate } from '$lib/todaysMovie.js';
import { getDateFromHeaders } from '$lib/utils.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, url, request: { headers } }) {
	const apiClient = getApiClient(fetch);
	const guessId = url.searchParams.get('guessId');

	const date = getDateFromHeaders(headers);

	const numberOfGuesses = headers.get('client-guesses');

	if (!guessId)
		return new Response(JSON.stringify({ message: 'guessId is required' }), { status: 400 });

	const todaysMovie = await getMovieForDate(date);

	try {
		const res = await apiClient(`movie/${guessId}?append_to_response=credits`);
		if (!res.ok) {
			return new Response(JSON.stringify({ message: 'something went wrong' }), { status: 500 });
		}
		const guessedMovie = (await res.json()) as DetailsResponse;

		const guess = getGuess({ guessId, todaysMovie, guessedMovie });

		const possibleHint = guess.correct ? undefined : getHint({ numberOfGuesses, todaysMovie });

		return new Response(
			JSON.stringify({
				guess,
				hint: possibleHint,
				correctMovie:
					numberOfGuesses === '10' && !guess.correct
						? getGuess({ guessId: String(todaysMovie.id), todaysMovie, guessedMovie: todaysMovie })
						: undefined
			})
		);
	} catch (error) {
		return new Response(JSON.stringify({ message: 'something went wrong', error }), {
			status: 500
		});
	}
}
