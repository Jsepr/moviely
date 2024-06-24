<script lang="ts">
	import { type Guess as GuessType } from '$lib/types/guess';
	import Guess from './guess.svelte';

	type $$Props = { guesses: GuessType[]; class?: string };

	export let guesses: $$Props['guesses'] = [];
</script>

<div class="flex flex-col gap-2 my-4">
	{#each guesses as guess (guess.id)}
		<Guess {guess} />
	{/each}
</div>
