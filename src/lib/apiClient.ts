import { TMDB_API_KEY } from '$env/static/private';

export function getApiClient(fetchFunction: typeof fetch): typeof fetch {
	return (url, init) =>
		fetchFunction(`https://api.themoviedb.org/3/${url}`, {
			...init,
			headers: {
				accept: 'application/json',
				Authorization: TMDB_API_KEY
			}
		});
}
