<script lang="ts">
	import {
		isCountriesCategory,
		isMultiStringCategory,
		isYearCategory,
		type Guess
	} from '$lib/types/guess';
	import { formatNumberCategoryValue } from '$lib/utils';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	type $$Props = { guesses: Guess[]; class?: string };

	export let guesses: $$Props['guesses'] = [];
</script>

<div class="flex flex-col gap-2">
	{#each guesses as guess (guess.id)}
		<div
			animate:flip={{ duration: 400 }}
			transition:fade={{ duration: 400 }}
			class={`flex  gap-2 rounded-2xl  p-4 ${guess.correct ? 'bg-green-400 shadow-2xl shadow-green-400' : 'bg-gray-300'}`}
		>
			<img src={guess.posterSrc} alt={`poster image`} class="h-36 w-auto" />
			<div class="flex flex-col">
				<h2 class="font-sans font-semibold">{guess.title}</h2>
				<div class="grid grid-cols-1 flex-wrap gap-2 md:flex md:flex-row">
					{#each guess.categories.filter((c) => c.value !== null) as category}
						<div
							class={`flex gap-2 p-2 ${category.correct ? 'border-green-600' : isYearCategory(category) && category.proximity === 'close' ? 'border-yellow-200' : 'border-black'} rounded-lg border-2 border-solid `}
						>
							<span class="font-bold capitalize">{category.name}:</span>
							{#if isCountriesCategory(category)}
								<div class="flex flex-wrap gap-2">
									{#each category.value as country}
										<div class={`rounded-sm flex align-middle ${country.correct ? 'bg-green-400' : ''} p-2`}>
											<img
												src={`https://flagcdn.com/${country.value.toLowerCase()}.svg`}
												width="40"
												alt={country.name ?? country.value}
											/>
										</div>
									{/each}
								</div>
							{:else if isMultiStringCategory(category)}
								<div class="flex flex-wrap gap-2">
									{#each category.value as genre}
										<div class={`min-w-0 rounded-sm ${genre.correct ? 'bg-green-400' : ''} px-1`}>
											{genre.name}
										</div>
									{/each}
								</div>
							{:else}
								{formatNumberCategoryValue(category)}
								{#if category.correct}
									<Check class="text-green-600" />
								{/if}
								{#if category.hint === 'above'}
									<ChevronUp
										class={category.proximity === 'close' ? 'text-yellow-200' : 'text-black'}
									/>
								{:else if category.hint === 'below'}
									<ChevronDown
										class={category.proximity === 'close' ? 'text-yellow-200' : 'text-black'}
									/>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>
