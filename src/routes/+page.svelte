<script lang="ts">
	import Guesses from '$lib/components/guesses/guesses.svelte';
	import Search from '$lib/components/search/search.svelte';
	import type { Guess, Hint } from '$lib/types/guess';
	import { flip } from 'svelte/animate';
	import { tick } from 'svelte';
	import { getShareText, localStorageGetItem, localStorageSetItem } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

	let query = '';

	/** @type {import('./$types').PageData} */
	export let data;
	let guesses: Guess[] = localStorageGetItem({ key: 'moviely-guesses' }) ?? [];
	let hints: Hint[] = localStorageGetItem({ key: 'moviely-hints' }) ?? [];

	async function onSelect(guessId: string) {
		query = '';

		if (guesses.map((g) => g.id).includes(guessId)) {
			console.log('You have already guessed this movie');
			return;
		}

		try {
			const res = await fetch(`/api/guess?guessId=${guessId}`);
			if (!res.ok) {
				handleError(new Error('Something went wrong'));
				return;
			}
			const guess = (await res.json()) as Guess;

			guesses = [...guesses, guess];

			localStorageSetItem({ key: 'moviely-guesses', value: guesses });

			await tick();
			window.scroll({ top: window.innerHeight, behavior: 'smooth' });

			if (guesses.length > 0 && guesses.length % 3 === 0) {
				getHint();
			}
		} catch (error) {
			handleError(error as Error);
		}
		scrollToBottom();
	}

	async function scrollToBottom() {
		await tick();
		window.scroll({ top: document.getElementById('main')?.scrollHeight, behavior: 'smooth' });
	}

	async function getHint() {
		try {
			const res = await fetch(`/api/hint?numberOfGuesses=${guesses.length}`);
			if (!res.ok) {
				handleError(new Error('Something went wrong'));
				return;
			}
			const hint = (await res.json()) as Hint;

			hints = [...hints, hint];
		} catch (error) {
			handleError(error as Error);
		}
		scrollToBottom();
	}

	function handleError(error: Error) {
		console.log(error);
	}

	$: hasGuessedCorrect = guesses.some((g) => g.correct);
</script>

<svelte:head>
	<title>Moviely</title>
	<meta name="description" content="Movie quiz app" />
</svelte:head>
<section class="flex flex-1 flex-col justify-between gap-2 align-middle">
	<h1 class="mb-10 font-serif">Moviely</h1>
	<div class="flex flex-shrink-0 flex-grow flex-col justify-end">
		<Guesses bind:guesses />
	</div>
	<div class="flex-shrink">
		{#if hints.length > 0}
			<h2 class="mb-1 text-lg font-bold">Hints:</h2>
			<div class="flex gap-2">
				{#each hints.reverse() as hint (hint.value)}
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
		{#if !hasGuessedCorrect}
			<p class="flex justify-end text-xs text-gray-500">Guess {guesses.length + 1}</p>
			<Search bind:query {onSelect} hasGuessedCorrect={guesses.some((g) => g.correct)} />
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
								getShareText({ guesses, hints, date: data.date })
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
</section>
