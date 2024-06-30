import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import {
	isCountriesCategory,
	isLoadingGuess,
	isMultiStringCategory,
	type Guess,
	type Hint,
	type LoadingGuess,
} from './types/guess';
import { toZonedTime } from 'date-fns-tz';
import { addMinutes, format, parse } from 'date-fns';

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

export function getShareText({
	guesses,
	hints,
	date
}: {
	guesses: (Guess | LoadingGuess)[];
	hints: Hint[];
	date: string;
}) {
	const filteredGuesses = guesses.filter((g) => !isLoadingGuess(g)) as Guess[];
	return `🎬 Moviely ${date} 🍿

📅⏰⭐🌎🎭🧍🦹
${filteredGuesses
	.map((g) => {
		if (g.correct) return g.categories.map(() => '🟩').join('');
		return g.categories
			.map((c) => {
				if (c.correct) return '🟩';
				if (
					c.proximity === 'close' ||
					((isMultiStringCategory(c) || isCountriesCategory(c)) &&
						c.value.some((cv) => cv.correct || cv.sameContinent))
				)
					return '🟨';
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

export function getDateFromHeaders(headers: Headers) {
	let date = format(new Date(), 'yyyy-MM-dd');

	const clientDateTime = headers.get('client-datetime');
	const clientTimezone = headers.get('client-timezone');

	// get date from client
	if (clientDateTime && clientTimezone) {
		const currentDateInClientTimezone = toZonedTime(new Date(), clientTimezone);
		const parsedClientDateTime = parse(clientDateTime, 'yyyy-MM-dd HH:mm', new Date());

		// 5 minutes diff is fine, otherwise use server date
		if (parsedClientDateTime <= addMinutes(currentDateInClientTimezone, 5)) {
			date = format(parsedClientDateTime, 'yyyy-MM-dd');
		}
	}
	return date;
}
