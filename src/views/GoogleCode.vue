<template>
	<div class="code">
		
	</div>
</template>
<script>
export default {
	created() {
		console.log(this.$route.query);
		this.$router.replace({ 
			name: 'Contacts', 
			query: { 
				type: 'linkingGoogle',
				data: this.$route.query
			} 
		});
	}
}
</script>