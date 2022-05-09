<template>
	<div class="page-header">
		{{ category }}
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters({
			user: 'profile',
		}),

		category: function() {
			if( this.$route.path === '/friends' || this.$route.path === '/friends/' ) {
				return `Danh sách bạn bè của ${this.user.fullname}`;
			} else if( this.$route.path === '/friends/invitations' 
								|| this.$route.path === '/friends/invitations/') {
				return 'Danh sách lời mời kết bạn'
			} else if( this.$route.path === '/friends/find' 
								|| this.$route.path === '/friends/find/' ) {
				return 'Tìm kiếm bạn mới và kết nối toàn cầu'
			} else return 'notFound'
		}
	},
}
</script>

<style lang="scss" scoped>
.page-header {
	height: 61px;
	line-height: 60px;
	font-size: 22px;
	font-weight: 700;
	border-bottom: 1px solid #dfdfdf;
	z-index: 10;
	box-shadow: 0px 2px 6px -3px rgba(9, 30, 66, .2);
	text-align: center;
	user-select: none;
}
</style>