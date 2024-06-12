<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import type { SearchMovie } from '$lib/types/movie';
	import { Loader2 } from 'lucide-svelte';
	import { baseImageUrl } from '$lib/constants';
	import { lazyLoad } from './lazyLoad';

	type $$Props = { query: string; onSelect?: (value: string) => void; hasGuessedCorrect: boolean };

	export let query: $$Props['query'] = '';
	export let onSelect: $$Props['onSelect'] = undefined;
	export let hasGuessedCorrect: $$Props['hasGuessedCorrect'] = false;

	let loading = false;
	let movies: SearchMovie[] = [];
	let timeout: ReturnType<typeof setTimeout>;

	function handleSearch(query: string) {
		if (!query) {
			reset();
			return;
		}

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
			.catch((e) => handleError());

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
	}

	$: query, handleSearch(query);
</script>

<div class={hasGuessedCorrect ? 'h-auto' : 'h-56'}>
	<Command.Root shouldFilter={false}>
		<Command.Input
			bind:value={query}
			disabled={hasGuessedCorrect}
			type="search"
			placeholder={hasGuessedCorrect
				? 'You have guessed the correct movie!'
				: "Guess today's movie..."}
		/>
		<Command.List>
			{#if loading && !movies.length}
				<div class="flex justify-center p-3">
					<Loader2 class="animate-spin" />
				</div>
			{/if}
			{#each movies as movie (movie.id)}
				<Command.Item value={String(movie.id)} {onSelect} class="flex gap-2">
					{#if movie.poster_path}
						<div class="w-10">
							<img
								use:lazyLoad={`${baseImageUrl}w154${movie.poster_path}`}
								alt={`poster image`}
								class="h-16 w-auto"
							/>
						</div>
					{/if}
					<span>{movie.title}</span>
				</Command.Item>
			{/each}
		</Command.List>
	</Command.Root>
</div>
