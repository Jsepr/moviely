<script lang="ts">
	type $$Props = { name: string; isCorrect: boolean; isClose: boolean };

	export let name: $$Props['name'];
	export let isCorrect: $$Props['isCorrect'];
	export let isClose: $$Props['isClose'];
</script>

<div
	class={`flex gap-2 p-2 ${isCorrect ? 'border-correct' : isClose ? 'border-close' : 'border-black'} rounded-lg border-2 border-solid `}
>
	<span class="font-bold capitalize">{name}:</span>

	<slot />
</div>
