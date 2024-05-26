<script>
	import '../app.css';
	import { Navbar } from '$lib/components';

	export let data;

	$: user = data.user;
</script>

<svelte:head>
	<title>Praesto Predictor</title>
</svelte:head>

<Navbar {user} />
<slot />
