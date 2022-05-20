<template>
	<div id="friends-page">
		<div class="sub-sidebar">
			<SubSidebar></SubSidebar>
		</div>
		<div class="friends-page__router">
			<PageHeader></PageHeader>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import SubSidebar from '@/components/friendsPage/SubSidebar'
import PageHeader from '@/components/friendsPage/PageHeader'

export default {
	components: {
		SubSidebar,
		PageHeader
	}
}
</script>

<style lang="scss" scoped>
#friends-page {
	display: flex;
	min-height: inherit;
  height: calc(100vh - 58px - 80px - 0rem);

	.sub-sidebar {
		height: inherit;
		flex-basis: 340px;
		border-right: 1px solid #dfdfdf;
		box-shadow: 2px 0px 6px -3px rgba(9, 30, 66, .2);
	}

	.friends-page__router {
		flex-grow: 1;
		height: inherit;
	}
}
</style>