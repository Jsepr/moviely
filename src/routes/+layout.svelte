<script>
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from '$lib/components/ui/sonner';
	import { inject } from '@vercel/analytics';

	import '../app.css';

	inject();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60 * 60
			}
		}
	});
</script>

<Toaster position="top-center" />

<div class="flex flex-col items-center justify-center">
	<div class="max-w-6xl">
		<img src="/logo-with-text.png" alt="Moviely logo" class="block h-auto max-h-48 w-auto" />
	</div>
	<main id="main" class="flex flex-1 flex-col">
		<QueryClientProvider client={queryClient}>
			<slot></slot>
		</QueryClientProvider>
	</main>
</div>

<style>
	main {
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
