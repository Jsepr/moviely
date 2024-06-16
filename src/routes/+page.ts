// since there's no dynamic data here, we can prerender

import { localStorageClear, localStorageGetItem, localStorageSetItem } from '$lib/utils';
import { format } from 'date-fns';

// it so that it gets served as a static asset in production
export const prerender = true;
export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const storedDate = localStorageGetItem({ key: 'moviely-date' });
	const date = format(new Date(), 'yyyy-MM-dd');

	if (storedDate !== date) {
		localStorageClear();
	}

	localStorageSetItem({ key: 'moviely-date', value: date });

	return {
		date
	};
}
