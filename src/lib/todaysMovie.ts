import { format } from 'date-fns';

import { kv } from '@vercel/kv';
import type { DetailsResponse } from './types/movie';

export async function getTodaysMovie() {
	const todaysDate = new Date();

	const movie = await kv.get<DetailsResponse>(format(todaysDate, 'yyyy-MM-dd'));
	if (!movie) throw new Error('No movie found for todays date');

	return movie;
}

export const todaysMovie = await getTodaysMovie();
