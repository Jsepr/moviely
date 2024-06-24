import { baseImageUrl } from '$lib/constants.js';
import { getMovieForDate } from '$lib/todaysMovie.js';
import type { Hint } from '$lib/types/guess.js';
import { getDateFromHeaders } from '$lib/utils.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, request: { headers } }) {
	const numberOfGuesses = url.searchParams.get('numberOfGuesses');

	const date = getDateFromHeaders(headers);

	if (!numberOfGuesses)
		return new Response(JSON.stringify({ message: 'numberOfGuesses is required' }), {
			status: 400
		});

	const todaysMovie = await getMovieForDate(date);

	try {
		let hint: Hint | null = null;
		if (numberOfGuesses === '3') {
			hint = {
				type: 'tagline',
				value: todaysMovie.tagline ?? "This movie doesn't have a tagline :("
			};
		} else if (numberOfGuesses === '6') {
			hint = {
				type: 'image',
				value: `${baseImageUrl}w154${todaysMovie.poster_path}`
			};
		}
		if (!hint)
			return new Response(JSON.stringify({ message: 'not valid guessNumber' }), { status: 400 });
		return new Response(JSON.stringify(hint));
	} catch (error) {
		return new Response(JSON.stringify({ message: 'something went wrong', error }), {
			status: 500
		});
	}
}
