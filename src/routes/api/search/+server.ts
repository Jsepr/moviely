import { getApiClient } from '$lib/apiClient.js';
import { baseImageUrl } from '$lib/constants.js';
import type { MovielySearchMovie, SearchMovieResponse } from '$lib/types/movie.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, url }) {
	const apiClient = getApiClient(fetch);
	const query = url.searchParams.get('query');
	try {
		const res = await apiClient(`search/movie?include_adult=false&page=1&query=${query}`);
		if (!res.ok) {
			return new Response(JSON.stringify({ message: 'something went wrong' }), { status: 500 });
		}
		const movies = ((await res.json()) as SearchMovieResponse).results;
		const moviesResponse: MovielySearchMovie[] = movies.map(({ id, title, poster_path }) => ({
			id,
			title,
			posterPath: poster_path ? `${baseImageUrl}w154${poster_path}` : null
		}));
		return new Response(JSON.stringify(moviesResponse));
	} catch (error) {
		return new Response(JSON.stringify({ message: 'something went wrong', error }), {
			status: 500
		});
	}
}
