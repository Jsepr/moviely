<script lang="ts">
	type $$Props = { name: string; isCorrect: boolean; isCorrectMovie: boolean; isClose: boolean };

	export let name: $$Props['name'];
	export let isCorrect: $$Props['isCorrect'];
	export let isClose: $$Props['isClose'];
	export let isCorrectMovie: $$Props['isCorrectMovie'];
</script>

<div
	class={`flex gap-2 p-2 ${isCorrectMovie ? 'border-black' : isCorrect ? 'border-correct' : isClose ? 'border-close' : 'border-black'} animate-fade-in rounded-lg border-2 border-solid`}
>
	<span class="font-bold capitalize">{name}:</span>

	<slot />
</div>
