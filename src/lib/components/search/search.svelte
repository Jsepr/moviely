<script lang="ts">
	import type { MovielySearchMovie } from '$lib/types/movie';
	import * as Popover from '$lib/components/ui/popover';
	import Search from 'lucide-svelte/icons/search';

	import { lazyLoad } from './lazyLoad';
	import { Skeleton } from '../ui/skeleton';
	import Input from '../ui/input/input.svelte';
	import { onMount } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { slide } from 'svelte/transition';

	type $$Props = {
		searchInput: string;
		onSelect: (value: MovielySearchMovie) => void;
		disabled: boolean;
	};

	export let searchInput: $$Props['searchInput'] = '';
	export let onSelect: $$Props['onSelect'];
	export let disabled: $$Props['disabled'] = false;

	let input: HTMLInputElement;

	let query: string = '';
	let timeout: ReturnType<typeof setTimeout>;
	let popoverOpen = false;

	function handleSearch(searchInput: string) {
		if (!searchInput) {
			reset();
			return;
		}

		popoverOpen = true;
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			query = searchInput;
		}, 300);
	}

	function handleError() {
		alert('Something went wrong.');
		reset();
	}

	function reset() {
		popoverOpen = false;
		query = '';
	}

	function getSkeletonTitleWidth() {
		const widths = ['w-[20%]', 'w-[40%]', 'w-[60%]', 'w-[80%]'];
		const index = Math.floor(Math.random() * widths.length);
		return widths[index];
	}

	onMount(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === ' ') {
				event.stopPropagation();
			}
		};

		input?.addEventListener('keydown', handleKeyDown);

		return () => {
			input?.removeEventListener('keydown', handleKeyDown);
		};
	});

	$: searchResults = createQuery({
		queryKey: ['search', query],
		queryFn: async () =>
			await fetch(`/api/search?query=${query}`)
				.then(async (res) => {
					if (!res.ok) {
						handleError();
						return;
					}
					const movies = await res.json();
					return movies as MovielySearchMovie[];
				})
				.catch(() => handleError()),
		enabled: !!query
	});
	$: movies = $searchResults.data ?? [];

	$: searchInput, handleSearch(searchInput);
</script>

<div class={`w-full`} transition:slide>
	<Popover.Root disableFocusTrap bind:open={popoverOpen}>
		<Popover.Trigger class="w-full" asChild role="textbox" let:builder>
			<Input
				ref={input}
				builders={[builder]}
				bind:value={searchInput}
				{disabled}
				placeholder={"Guess today's movie..."}
			>
				<Search slot="start-icon" class="opacity-50" />
			</Input>
		</Popover.Trigger>
		<Popover.Content
			sameWidth
			align="center"
			side="bottom"
			avoidCollisions={false}
			sideOffset={10}
			class="h-96 overflow-auto bg-card p-0"
		>
			<div class="flex flex-col gap-2">
				{#if !searchInput}
					<p class="text-center">Enter a movie title to search</p>
				{:else if $searchResults.isLoading || (searchInput && !query)}
					{#each Array(6).fill(0) as _}
						<div class="flex items-start gap-2 p-2">
							<Skeleton class="h-16 w-10 flex-shrink rounded-sm" />
							<Skeleton class={`h-4 ${getSkeletonTitleWidth()}`} />
						</div>
					{/each}
				{:else if $searchResults.isSuccess && !!movies.length}
					{#each movies as movie (movie.id)}
						<button
							type="button"
							on:click={() => {
								onSelect(movie);
								reset();
							}}
							class="flex items-start justify-start gap-2 p-2 hover:bg-slate-100"
						>
							<div class="h-16 w-10 flex-shrink-0">
								{#if movie.posterPath}
									<img
										use:lazyLoad={movie.posterPath}
										alt={`poster image`}
										class="h-full w-full rounded-sm bg-slate-200 opacity-[0.2] transition-opacity duration-300"
									/>
								{:else}
									<div class="h-full w-full rounded-sm bg-slate-200"></div>
								{/if}
							</div>
							<span class="text-left">{movie.title}</span>
						</button>
					{/each}
				{:else}
					<p class="text-center">No movies found</p>
				{/if}
			</div>
		</Popover.Content>
	</Popover.Root>
	<!-- </Command.Root> -->
</div>
