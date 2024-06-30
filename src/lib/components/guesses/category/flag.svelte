<script lang="ts">
	import type { CountryValue } from '$lib/types/guess';

	type $$Props = { country: CountryValue, isCorrectMovie: boolean};

	export let country: $$Props['country'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];
</script>

<div
	class={`flex rounded-sm align-middle ${country.correct && !isCorrectMovie ? 'bg-correct' : ''} p-2`}
>
	<img
		src={`https://flagcdn.com/${country.value.toLowerCase()}.svg`}
		width="40"
		alt={country.name ?? country.value}
	/>
</div>
