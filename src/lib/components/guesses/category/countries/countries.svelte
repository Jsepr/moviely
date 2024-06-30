<script lang="ts">
	import { HoverCard, HoverCardContent, HoverCardTrigger } from '$lib/components/ui/hover-card';
	import { type CountriesCategory } from '$lib/types/guess';
	import CategoryBox from '../category-box.svelte';
	import Flag from './flag.svelte';

	type $$Props = { category: CountriesCategory; isCorrectMovie: boolean; class?: string };

	export let category: $$Props['category'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];

	$: isClose = category.value.some((c) => c.correct || c.sameContinent);
</script>

<CategoryBox name={category.name} {isCorrectMovie} isCorrect={category.correct} {isClose}>
	<div class="flex flex-wrap gap-2">
		{#each category.value as country}
			{#if country.sameContinent && !country.correct}
				<HoverCard openDelay={200}>
					<HoverCardTrigger asChild let:builder class="cursor-help">
						<Flag {country} {isCorrectMovie} builders={[builder]}/>
					</HoverCardTrigger>
					<HoverCardContent class="italic">
						Today's movie was produced in the same continent as this country
					</HoverCardContent>
				</HoverCard>
			{:else}
				<Flag {country} {isCorrectMovie} />
			{/if}
		{/each}
	</div>
</CategoryBox>
