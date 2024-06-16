<script lang="ts">
	import type { SearchMovie } from '$lib/types/movie';
	import * as Popover from '$lib/components/ui/popover';
	import Search from 'lucide-svelte/icons/search';

	import { baseImageUrl } from '$lib/constants';
	import { lazyLoad } from './lazyLoad';
	import { Skeleton } from '../ui/skeleton';
	import Input from '../ui/input/input.svelte';
	import { onMount } from 'svelte';

	type $$Props = { query: string; onSelect: (value: string) => void; hasGuessedCorrect: boolean };

	export let query: $$Props['query'] = '';
	export let onSelect: $$Props['onSelect'];
	export let hasGuessedCorrect: $$Props['hasGuessedCorrect'] = false;

	let input: HTMLInputElement;
	let loading = false;
	let movies: SearchMovie[] = [];
	let timeout: ReturnType<typeof setTimeout>;
	let popoverOpen = false;

	function handleSearch(query: string) {
		if (!query) {
			reset();
			return;
		}
		popoverOpen = true;
		loading = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => getMovies(query), 300);
	}

	async function getMovies(query: string) {
		const data = await fetch(`/api/search?query=${query}`)
			.then((res) => {
				if (!res.ok) {
					handleError();
					return;
				}
				return res.json();
			})
			.catch(() => handleError());

		movies = (data as SearchMovie[]) || [];
		loading = false;
	}

	function handleError() {
		alert('Something went wrong.');
		reset();
	}

	function reset() {
		movies = [];
		loading = false;
		popoverOpen = false;
	}

	function getSkeletonTitleWidth() {
		const widths = ['w-[30%]', 'w-[40%]', 'w-[60%]', 'w-[80%]'];
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

	$: query, handleSearch(query);
</script>

<div class={`w-full`}>
	<Popover.Root disableFocusTrap bind:open={popoverOpen}>
		<Popover.Trigger class="w-full" asChild role="textbox" let:builder>
			<Input
				ref={input}
				builders={[builder]}
				bind:value={query}
				disabled={hasGuessedCorrect}
				placeholder={hasGuessedCorrect
					? 'You have guessed the correct movie!'
					: "Guess today's movie..."}
			>
				<Search slot="start-icon" class="opacity-50" />
			</Input>
		</Popover.Trigger>
		<Popover.Content
			sameWidth
			align="center"
			sideOffset={10}
			class="h-96 overflow-auto bg-card p-0"
		>
			<div class="flex flex-col gap-2">
				{#if !query}
					<p class="text-center">Enter a movie title to search</p>
				{:else if loading}
					{#each Array(5).fill(0) as _}
						<div class="flex items-start gap-2 p-2">
							<Skeleton class="h-16 w-10 flex-shrink rounded-sm" />
							<Skeleton class={`h-4 ${getSkeletonTitleWidth()}`} />
						</div>
					{/each}
				{:else if movies.length > 0}
					{#each movies as movie (movie.id)}
						<button
							type="button"
							on:click={() => {
								onSelect(String(movie.id));
								reset();
							}}
							class="flex items-start justify-start gap-2 p-2 hover:bg-slate-100"
						>
							<div class="w-10 h-16 flex-shrink-0">
								{#if movie.poster_path}
									<img
										use:lazyLoad={`${baseImageUrl}w154${movie.poster_path}`}
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
