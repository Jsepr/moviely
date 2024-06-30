<script lang="ts">
	import { type MultiStringAnswerCategory } from '$lib/types/guess';
	import CategoryBox from '../category-box.svelte';

	type $$Props = { category: MultiStringAnswerCategory; isCorrectMovie: boolean; class?: string };

	export let category: $$Props['category'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];
</script>

<CategoryBox
	name={category.name}
	{isCorrectMovie}
	isCorrect={category.correct}
	isClose={category.value.some((c) => c.correct)}
>
	<div class={`flex flex-wrap gap-2`}>
		{#each category.value as genre}
			<div
				class={`min-w-0 rounded-sm ${genre.correct && !isCorrectMovie ? 'bg-correct' : ''} px-1`}
			>
				{genre.name}
			</div>
		{/each}
	</div>
</CategoryBox>
