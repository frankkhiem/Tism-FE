<template>
	<div id="friends-page">
		<div class="sub-sidebar">
			<SubSidebar></SubSidebar>
		</div>
		<div class="friends-page__router">
			fweaf
		</div>
	</div>
</template>

<script>
import SubSidebar from '@/components/friendsPage/SubSidebar'

export default {
	components: {
		SubSidebar
	}
}
</script>

<style lang="scss" scoped>
#friends-page {
	display: flex;
	min-height: inherit;

	.sub-sidebar {
		flex-basis: 350px;
		border-right: 1px solid #dfdfdf;
		box-shadow: 2px 0px 6px -3px rgba(9, 30, 66, .2)
	}

	.friends-page__router {
		flex-grow: 1;
	}
}
</style>