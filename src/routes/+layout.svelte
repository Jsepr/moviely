<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
</script>

<Toaster position="top-center" />

<div class="flex h-full flex-col items-center justify-center">
	<div class="max-w-6xl">
		<img src="/logo-with-text.png" alt="Moviely logo" class="block h-auto max-h-48 w-auto" />
	</div>
	<main id="main" class="flex flex-1 flex-col">
		<slot></slot>
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
