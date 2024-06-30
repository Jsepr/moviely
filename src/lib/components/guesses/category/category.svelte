<script lang="ts">
	import {
		isCountriesCategory,
		isMultiStringCategory,
		type AnswerCategory
	} from '$lib/types/guess';
	import Countries from './countries/countries.svelte';
	import MultiString from './multi-string/multi-string.svelte';
	import Numbers from './numbers/numbers.svelte';

	type $$Props = { category: AnswerCategory; isCorrectMovie: boolean; class?: string };

	export let category: $$Props['category'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];
</script>

{#if isCountriesCategory(category)}
	<Countries {category} {isCorrectMovie} />
{:else if isMultiStringCategory(category)}
	<MultiString {category} {isCorrectMovie} />
{:else}
	<Numbers {category} {isCorrectMovie} />
{/if}
