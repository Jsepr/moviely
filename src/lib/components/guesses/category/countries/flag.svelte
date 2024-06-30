<script lang="ts">
	import type { CountryValue } from '$lib/types/guess';
	import { builderActions, getAttrs, type Builder } from 'bits-ui';

	type $$Props = { country: CountryValue; isCorrectMovie: boolean; builders?: Builder[] };

	export let country: $$Props['country'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];

	export let builders: $$Props['builders'] = [];
</script>

<div
	class={`flex rounded-sm align-middle ${country.correct && !isCorrectMovie ? 'bg-correct' : country.sameContinent && !country.correct ? 'bg-close' : ''} p-1 ${builders?.length ? 'cursor-help' : ''}`}
	use:builderActions={{ builders: builders ?? [] }}
	{...getAttrs(builders ?? [])}
>
	<img
		src={`https://flagcdn.com/${country.value.toLowerCase()}.svg`}
		width="24"
		alt={country.name ?? country.value}
	/>
</div>
