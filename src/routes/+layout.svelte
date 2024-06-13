<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
	import './styles.css';
</script>

<Toaster position="top-center"/>

<div class="app">
	<main id="main">
		<slot></slot>
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
