<script lang="ts">
	import Guesses from '$lib/components/guesses/guesses.svelte';
	import Search from '$lib/components/search/search.svelte';
	import type { Guess, Hint } from '$lib/types/guess';
	import { flip } from 'svelte/animate';
	import { tick } from 'svelte';

	let query = '';

	let guesses: Guess[] = [];
	let hints: Hint[] = [];

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
		console.log('getHint');
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

	let hasGuessedCorrect = guesses.some((g) => g.correct);
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
			<p class="flex justify-end text-xs text-gray-500">Guess number {guesses.length + 1}</p>
		{/if}
		<Search bind:query {onSelect} hasGuessedCorrect={guesses.some((g) => g.correct)} />
	</div>
</section>
