<script lang="ts">
	import Guesses from '$lib/components/guesses/guesses.svelte';
	import Search from '$lib/components/search/search.svelte';
	import type { Guess, GuessResponse, Hint } from '$lib/types/guess';
	import { flip } from 'svelte/animate';
	import { getShareText, localStorageGetItem, localStorageSetItem } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import type { DetailsResponse } from '$lib/types/movie';
	import GuessCard from '$lib/components/guesses/guess.svelte';

	let searchInput = '';

	/** @type {import('./$types').PageData} */
	export let data: {
		datetime: string;
		guesses: Guess[];
		hints: Hint[];
		correctMovie?: Guess | null;
		date: string;
		timezone: string;
	};

	let guesses = data.guesses;
	let hints = data.hints;
	let correctMovie = data.correctMovie;

	async function onSelect(guessId: string) {
		searchInput = '';

		if (guesses.some((g) => g.id === guessId)) {
			toast('You have already guessed this movie');
			return;
		}

		try {
			const res = await fetch(`/api/guess?guessId=${guessId}`, {
				headers: {
					'client-datetime': data.datetime,
					'client-timezone': data.timezone,
					'client-guesses': String(guesses.length + 1)
				}
			});

			if (!res.ok) {
				handleError(new Error('Something went wrong'));
				return;
			}
			const guessResponse = (await res.json()) as GuessResponse;

			guesses = [guessResponse.guess, ...guesses];

			localStorageSetItem({ key: 'moviely-guesses', value: guesses });

			if (guessResponse.hint) {
				hints = [...hints, guessResponse.hint];
				localStorageSetItem({ key: 'moviely-hints', value: hints });
			}

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
	$: hasGuessedCorrect = guesses.some((g) => g.correct);
</script>

<svelte:head>
	<title>Moviely</title>
	<meta name="description" content="Movie quiz app" />
</svelte:head>
<section class="flex flex-1 flex-col justify-between gap-2 align-middle">
	<div class="flex-shrink">
		{#if hints.length > 0}
			<h2 class="mb-1 text-lg font-bold">Hints:</h2>
			<div class="flex gap-2">
				{#each hints.slice().reverse() as hint (hint.value)}
					<div class="mb-2 flex flex-col" animate:flip={{ duration: 300 }}>
						{#if hint.type === 'image'}
							<img src={hint.value} alt="hint" class="w-fit blur-lg" />
						{:else}
							<div class=" rounded-md bg-white p-4">
								<span class="capitalize">{hint.type}</span>:
								<span class="italic">{hint.value}</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
		{#if !!correctMovie}
			<div class="mb-4 mt-4 rounded-xl bg-card p-4">
				<h2 class="mb-1 text-center">You failed to guess today's movie :( Try again tomorrow!</h2>
				<h3 class="mb-2 text-center font-bold">Today's movie was</h3>
				<GuessCard guess={correctMovie} />
			</div>
		{:else if !hasGuessedCorrect}
			<p class="mb-1 flex justify-end text-xs text-white">Guess {guesses.length + 1} of 10</p>
			<Search bind:searchInput {onSelect} disabled={hasGuessedCorrect || !!correctMovie} />
		{:else}
			<div class="flex flex-col align-middle">
				<h3 class="mb-8 mt-8 text-center">
					You guessed the correct movie in {guesses.length} guesses!
				</h3>
				<Button
					class="m-auto mb-16"
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
			</div>
		{/if}
	</div>
	<div class="flex flex-shrink-0 flex-grow flex-col justify-end">
		<Guesses bind:guesses />
	</div>
</section>
