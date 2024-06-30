<script lang="ts">
	import {
		isCountriesCategory,
		isMultiStringCategory,
		type AnswerCategory
	} from '$lib/types/guess';
	import { formatNumberCategoryValue } from '$lib/utils';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import CategoryBox from './category-box.svelte';
	import Flag from './flag.svelte';

	type $$Props = { category: AnswerCategory; isCorrectMovie: boolean; class?: string };

	export let category: $$Props['category'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];
</script>

{#if isCountriesCategory(category)}
	{@const isClose = category.value.some((c) => c.correct || c.sameContinent)}
	<CategoryBox name={category.name} {isCorrectMovie} isCorrect={category.correct} {isClose}>
		<div class="flex flex-wrap gap-2">
			{#each category.value as country}
				<Flag {country} {isCorrectMovie} />
			{/each}
		</div>
	</CategoryBox>
{:else if isMultiStringCategory(category)}
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
{:else}
	<CategoryBox
		name={category.name}
		{isCorrectMovie}
		isCorrect={category.correct}
		isClose={category.proximity === 'close'}
	>
		{formatNumberCategoryValue(category)}
		{#if category.correct && !isCorrectMovie}
			<Check class="text-green-600" />
		{/if}
		{#if category.hint === 'above'}
			<ChevronUp class={category.proximity === 'close' ? 'text-close' : 'text-black'} />
		{:else if category.hint === 'below'}
			<ChevronDown class={category.proximity === 'close' ? 'text-close' : 'text-black'} />
		{/if}
	</CategoryBox>
{/if}
