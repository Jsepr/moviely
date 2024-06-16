<script lang="ts">
	import {
		isCountriesCategory,
		isMultiStringCategory,
		type AnswerCategory
	} from '$lib/types/guess';
	import { formatNumberCategoryValue } from '$lib/utils';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import CategoryBox from './category-box.svelte';

	type $$Props = { category: AnswerCategory; class?: string };

	export let category: $$Props['category'];
</script>

{#if isCountriesCategory(category)}
	<CategoryBox
		name={category.name}
		isCorrect={category.correct}
		isClose={category.value.some((c) => c.correct || c.sameContinent)}
	>
		<div class="flex flex-wrap gap-2">
			{#each category.value as country}
				<div class={`flex rounded-sm align-middle ${country.correct ? 'bg-correct' : ''} p-2`}>
					<img
						src={`https://flagcdn.com/${country.value.toLowerCase()}.svg`}
						width="40"
						alt={country.name ?? country.value}
					/>
				</div>
			{/each}
		</div>
	</CategoryBox>
{:else if isMultiStringCategory(category)}
	<CategoryBox
		name={category.name}
		isCorrect={category.correct}
		isClose={category.value.some((c) => c.correct)}
	>
		<div class={`flex flex-wrap gap-2`}>
			{#each category.value as genre}
				<div class={`min-w-0 rounded-sm ${genre.correct ? 'bg-correct' : ''} px-1`}>
					{genre.name}
				</div>
			{/each}
		</div>
	</CategoryBox>
{:else}
	<CategoryBox
		name={category.name}
		isCorrect={category.correct}
		isClose={category.proximity === 'close'}
	>
		{formatNumberCategoryValue(category)}
		{#if category.correct}
			<Check class="text-green-600" />
		{/if}
		{#if category.hint === 'above'}
			<ChevronUp class={category.proximity === 'close' ? 'text-close' : 'text-black'} />
		{:else if category.hint === 'below'}
			<ChevronDown class={category.proximity === 'close' ? 'text-close' : 'text-black'} />
		{/if}
	</CategoryBox>
{/if}
