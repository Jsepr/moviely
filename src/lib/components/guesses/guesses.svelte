<script lang="ts">
	import {
		isGuess,
		isHint,
		isLoadingGuess,
		type Guess as GuessType,
		type Hint,
		type LoadingGuess
	} from '$lib/types/guess';
	import Category from './category/category.svelte';
	import Skeleton from '../ui/skeleton/skeleton.svelte';
	import { fade, slide } from 'svelte/transition';
	import CorrectGuess from './correctGuess.svelte';

	type $$Props = { guessesAndHints: (GuessType | LoadingGuess | Hint)[]; class?: string };

	export let guessesAndHints: $$Props['guessesAndHints'] = [];
</script>

<div class="my-4 flex flex-col gap-2">
	{#each guessesAndHints as guess (guess.id)}
		<div
			class={`flex gap-4 rounded-2xl ${isHint(guess) ? 'bg-yellow-300' : isGuess(guess) && guess.correct ? 'mb-8 bg-correct shadow-2xl shadow-correct' : 'bg-card'} p-4 transition-colors duration-1000`}
			transition:slide
		>
			{#if isGuess(guess) && guess.correct}
				<CorrectGuess {guess} />
			{:else if isHint(guess)}
				<div class="flex flex-col gap-2">
					<h2 class="mb-1 text-lg font-bold">Hint:</h2>
					<div class="mb-2 flex flex-col gap-2">
						{#if guess.type === 'image'}
							<img src={guess.value} alt="hint" class="w-fit blur-lg" />
						{:else}
							<div>
								<!-- <span class="capitalize">{guess.type}</span>: -->
								<span class="italic">{guess.value}</span>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="h-36 w-24 flex-shrink-0">
					{#if guess.posterSrc}
						<img
							src={guess.posterSrc}
							alt={`poster image`}
							class="h-full w-full rounded-xl bg-slate-200"
						/>
					{:else}
						<div class="h-full w-full rounded-xl bg-slate-200"></div>
					{/if}
				</div>
				<div class="flex w-full flex-col gap-2">
					<h2 class="font-sans font-semibold">{guess.title}</h2>
					<div class="flex flex-col flex-wrap gap-2 md:flex-row">
						{#if isLoadingGuess(guess)}
							{#each Array(7).fill(null) as c}
								<div transition:fade={{ duration: 2000 }} class={`h-12 w-full md:w-32`}>
									<Skeleton class="h-full w-full" />
								</div>
								<!-- <Category {category} isCorrectMovie={guess.correct} /> -->
							{/each}
						{:else}
							{#each guess.categories.filter((c) => c.value !== null) as category}
								<Category {category} isCorrectMovie={guess.correct} />
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
