import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import type { Guess, Hint, NumberAnswerCategory } from './types/guess';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

function toHoursAndMinutes(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return { hours, minutes };
}

const formatMapper = {
	runtime: (value: number) => {
		const { hours, minutes } = toHoursAndMinutes(value);
		return `${hours}h ${minutes}m`;
	}
};
export function formatNumberCategoryValue({ name, value }: NumberAnswerCategory): string {
	if (!(name in formatMapper)) return String(value);
	return formatMapper[name as keyof typeof formatMapper](value);
}

type LocalStorage = {
	'moviely-guesses': Guess[];
	'moviely-hints': Hint[];
	'moviely-date': string;
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

export function getShareText({
	guesses,
	hints,
	date
}: {
	guesses: Guess[];
	hints: Hint[];
	date: string;
}) {
	return `🎬 Moviely ${date} 🍿

${guesses
	.map((g) => {
		if (g.correct) return g.categories.map(() => '🟩').join('');
		return g.categories
			.map((c) => {
				if (c.correct) return '🟩';
				if (c.proximity === 'close') return '🟨';
				return '⬜';
			})
			.join('');
	})
	.join('\n')}

Guesses 💭: ${guesses.length}
Hints 🐾: ${hints.length}

${window.location.origin}
`;
}
