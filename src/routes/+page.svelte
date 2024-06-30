<script lang="ts">
	import Guesses from '$lib/components/guesses/guesses.svelte';
	import Search from '$lib/components/search/search.svelte';
	import {
		isGuess,
		isHint,
		isLoadingGuess,
		type Guess,
		type GuessResponse,
		type Hint,
		type LoadingGuess
	} from '$lib/types/guess';
	import { getShareText } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import type { MovielySearchMovie } from '$lib/types/movie';
	import CorrectGuess from '$lib/components/guesses/correctGuess.svelte';
	import { slide } from 'svelte/transition';
	import { localStorageSetItem } from '$lib/utils/localStorage';

	let searchInput = '';

	/** @type {import('./$types').PageData} */
	export let data: {
		datetime: string;
		guessesAndHints: (Guess | LoadingGuess | Hint)[];
		correctMovie?: Guess | null;
		date: string;
		timezone: string;
	};

	let guessesAndHints = data.guessesAndHints;
	$: guesses = guessesAndHints.filter((g) => isGuess(g));
	$: numberOfGuesses = guesses.length;
	$: hints = guessesAndHints.filter((g) => isHint(g));
	let correctMovie = data.correctMovie;

	async function onSelect(guessedMovie: MovielySearchMovie) {
		searchInput = '';
		const guessId = String(guessedMovie.id);

		if (guessesAndHints.some((g) => g.id === guessId)) {
			toast('You have already guessed this movie');
			return;
		}

		const loadingGuess = {
			id: guessId,
			title: guessedMovie.title,
			posterSrc: guessedMovie.posterPath,
			loading: true
		};
		guessesAndHints = [loadingGuess, ...guessesAndHints];

		try {
			const res = await fetch(`/api/guess?guessId=${guessId}`, {
				headers: {
					'client-datetime': data.datetime,
					'client-timezone': data.timezone,
					'client-guesses': String(numberOfGuesses + 1)
				}
			});

			if (!res.ok) {
				handleError(new Error('Something went wrong'));
				return;
			}
			const guessResponse = (await res.json()) as GuessResponse;

			guessesAndHints = [guessResponse.guess, ...guessesAndHints.filter((g) => !isLoadingGuess(g))];

			if (guessResponse.hint) {
				guessesAndHints = [guessResponse.hint, ...guessesAndHints];
			}

			localStorageSetItem({
				key: 'moviely-guesses-and-hints',
				value: guessesAndHints.filter((g) => isGuess(g) || isHint(g))
			});

			if (guessResponse.correctMovie) {
				correctMovie = guessResponse.correctMovie;
				localStorageSetItem({ key: 'moviely-correct-movie', value: correctMovie });
			}
		} catch (error) {
			handleError(error as Error);
		}
	}

	function handleError(error: Error) {
		toast('Something went wrong');
		console.error(error);
	}

	$: correctMovie;
	$: hasGuessedCorrect = guessesAndHints.some((g) => isGuess(g) && g.correct);
</script>

<svelte:head>
	<title>Moviely</title>
	<meta name="description" content="Movie quiz app" />
</svelte:head>
<section class="flex flex-1 flex-col justify-between gap-2 align-middle">
	<div class="flex flex-shrink flex-col justify-center" transition:slide>
		{#if !!correctMovie || hasGuessedCorrect}
			<Button
				class="m-auto mb-4"
				on:click={async () => {
					try {
						await navigator.clipboard.writeText(
							getShareText({ guesses: guesses.slice().reverse(), hints, date: data.date })
						);
						toast('Copied result to clipboard');
					} catch (error) {
						toast('Could not copy result');
					}
				}}>Share your result!</Button
			>
		{/if}

		{#if !!correctMovie}
			<div class="mb-4 mt-4 rounded-xl bg-red-300 p-4">
				<h2 class="mb-1 text-center">You failed to guess today's movie :( Try again tomorrow!</h2>
				<h3 class="mb-2 text-center font-bold">Today's movie was</h3>
				<CorrectGuess guess={correctMovie} />
			</div>
		{:else if !hasGuessedCorrect}
			<p class="mb-2 flex justify-end text-xs text-white">
				Guess {numberOfGuesses + 1} of 10
			</p>
			<Search bind:searchInput {onSelect} disabled={hasGuessedCorrect || !!correctMovie} />
		{:else}
			<h3 class="mb-2 text-center">
				You guessed the correct movie in {numberOfGuesses} guesses!
			</h3>
		{/if}
	</div>
	<div class="flex flex-shrink-0 flex-grow flex-col justify-end">
		<Guesses bind:guessesAndHints />
	</div>
</section>
