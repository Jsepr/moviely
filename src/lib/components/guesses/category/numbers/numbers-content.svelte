<script lang="ts">
	import { type NumberAnswerCategory } from '$lib/types/guess';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import CategoryBox from '../category-box.svelte';
	import { formatNumberCategoryValue } from '../utils';

	type $$Props = { category: NumberAnswerCategory; isCorrectMovie: boolean; class?: string };

	export let category: $$Props['category'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];
</script>

<CategoryBox
	name={category.name}
	{isCorrectMovie}
	isCorrect={category.correct}
	isClose={category.proximity === 'close'}
>
	{formatNumberCategoryValue(category)}
	{#if category.hint === 'above'}
		<ChevronUp class={category.proximity === 'close' ? 'text-close' : 'text-black'} />
	{:else if category.hint === 'below'}
		<ChevronDown class={category.proximity === 'close' ? 'text-close' : 'text-black'} />
	{/if}
</CategoryBox>
