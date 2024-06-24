// since there's no dynamic data here, we can prerender

import { localStorageClear, localStorageGetItem, localStorageSetItem } from '$lib/utils';
import { format } from 'date-fns-tz';

// it so that it gets served as a static asset in production
export const prerender = true;
export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const storedDate = localStorageGetItem({ key: 'moviely-date' });
	const datetime = format(new Date(), 'yyyy-MM-dd HH:mm');
	const date = format(datetime, 'yyyy-MM-dd');

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	if (storedDate !== date) {
		localStorageClear();
	}

	localStorageSetItem({ key: 'moviely-date', value: date });
	const guesses = localStorageGetItem({ key: 'moviely-guesses' }) ?? [];
	const hints = localStorageGetItem({ key: 'moviely-hints' }) ?? [];
	const correctMovie = localStorageGetItem({
		key: 'moviely-correct-movie'
	});

	return {
		datetime,
		date,
		timezone,
		guesses,
		hints,
		correctMovie
	};
}
