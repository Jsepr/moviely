<script lang="ts">
	import { type NumberAnswerCategory } from '$lib/types/guess';
	import { HoverCard, HoverCardTrigger } from '$lib/components/ui/hover-card';
	import NumbersContent from './numbers-content.svelte';
	import HoverCardContent from '$lib/components/ui/hover-card/hover-card-content.svelte';
	import { categories } from '$lib/utils/categorySpecifications';

	type $$Props = { category: NumberAnswerCategory; isCorrectMovie: boolean; class?: string };

	export let category: $$Props['category'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];

	const categorySpecification = categories[category.name];
</script>

{#if category.hint}
	<HoverCard>
		<HoverCardTrigger class="cursor-help">
			<NumbersContent {category} {isCorrectMovie} />
		</HoverCardTrigger>
		<HoverCardContent class="italic">
			{#if category.hint === 'above'}
				{categorySpecification.getAboveText(category)}
			{:else}
				{categorySpecification.getBelowText(category)}
			{/if}
		</HoverCardContent>
	</HoverCard>
{:else}
	<NumbersContent {category} {isCorrectMovie} />
{/if}
