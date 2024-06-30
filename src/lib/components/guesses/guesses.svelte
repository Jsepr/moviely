<script lang="ts">
	import { isLoadingGuess, type Guess as GuessType, type LoadingGuess } from '$lib/types/guess';
	import Category from './category/category.svelte';
	import Skeleton from '../ui/skeleton/skeleton.svelte';
	import { fade, slide } from 'svelte/transition';

	type $$Props = { guesses: (GuessType | LoadingGuess)[]; class?: string };

	export let guesses: $$Props['guesses'] = [];
</script>

<div class="my-4 flex flex-col gap-2">
	{#each guesses as guess (guess.id)}
		<div
			class={`flex gap-4 rounded-2xl bg-card p-4 transition-[flex-grow] duration-1000`}
			transition:slide
		>
			<img src={guess.posterSrc} alt={`poster image`} class="h-36 w-auto rounded-xl" />
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
		</div>
	{/each}
</div>
