<script>
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient();
</script>

<svelte:head>
	<title>Praesto Predictor</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
