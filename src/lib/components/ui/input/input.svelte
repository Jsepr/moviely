<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputEvents } from './index.js';
	import { cn } from '$lib/utils.js';
	import { type Builder, getAttrs } from 'bits-ui';

	type $$Props = HTMLInputAttributes & {
		builders?: Builder[];
		ref?: HTMLInputElement;
	};
	type $$Events = InputEvents;

	export let builders: Builder[] = [];
	let className: $$Props['class'] = undefined;
	export let ref: $$Props['ref'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;
</script>

<div class="relative h-10">
	{#if $$slots['start-icon']}
		<div class="absolute left-2 top-0 flex h-full flex-col justify-center">
			<slot name="start-icon" />
		</div>
	{/if}

	<input
		bind:this={ref}
		class={cn(
			`flex w-full px-3 ${$$slots['start-icon'] ? 'pl-10' : ''} rounded-md border border-input bg-card  py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
			className
		)}
		{...getAttrs(builders)}
		role="textbox"
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:mousemove
		on:paste
		on:input
		on:wheel|passive
		{...$$restProps}
	/>
</div>
