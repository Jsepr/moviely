import type { Guess, Hint } from "$lib/types/guess";

type LocalStorage = {
	'moviely-guesses-and-hints': (Guess | Hint)[];
	'moviely-date': string;
	'moviely-correct-movie': Guess;
};

type LocalStorageKey = keyof LocalStorage;

type LocalStorageItem<TKey extends LocalStorageKey, TValue = LocalStorage[TKey]> = {
	key: TKey;
	value: TValue;
};
export function localStorageSetItem<TKey extends LocalStorageKey>({
	key,
	value
}: LocalStorageItem<TKey>) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(
			`Could not save ${key} to local-storage. Moviely will still work but won't save progress on reload.`,
			error
		);
	}
}

export function localStorageGetItem<TKey extends LocalStorageKey, TValue = LocalStorage[TKey]>({
	key
}: {
	key: TKey;
}) {
	try {
		const item = window.localStorage.getItem(key);
		if (!item) return null;
		return JSON.parse(item) as TValue;
	} catch (error) {
		console.error(
			`Could not get ${key} from local-storage. Moviely will still work but won't save progress on reload.`,
			error
		);
	}
}

export function localStorageClear() {
	try {
		window.localStorage.clear();
	} catch (error) {
		console.error(
			`Could not clear local-storage. You might have to clear local storage to get the latest question.`,
			error
		);
	}
}
