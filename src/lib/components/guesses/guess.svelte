<script lang="ts">
	import { type Guess } from '$lib/types/guess';
	import Category from './category/category.svelte';

	type $$Props = { guess: Guess; class?: string };

	export let guess: $$Props['guess'];
</script>

<div
	class={`flex  gap-4 rounded-2xl  p-4 ${guess.correct ? 'bg-correct shadow-2xl shadow-correct' : 'bg-card'}`}
>
	<img src={guess.posterSrc} alt={`poster image`} class="h-36 w-auto rounded-xl" />
	<div class="flex flex-col gap-2">
		<h2 class="font-sans font-semibold">{guess.title}</h2>
		<div class="grid grid-cols-1 flex-wrap gap-2 md:flex md:flex-row">
			{#each guess.categories.filter((c) => c.value !== null) as category}
				<Category {category} isCorrectMovie={guess.correct} />
			{/each}
		</div>
	</div>
</div>
