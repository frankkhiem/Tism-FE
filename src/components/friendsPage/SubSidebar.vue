<template>
	<div :style="{ height: 'inherit' }">
		<div class="section section--top">
			<div class="section__title">
				Danh mục
			</div>
			<div class="section__categories">
				<div 
					:class="{ activated: nav === 'listFriends' ? true : false }" 
					class="friends-list"
					@click="redirect('/friends')"
				>
					<b-icon icon="list-check" class="icon"></b-icon>
					Danh sách bạn bè
				</div>
				<div 
					:class="{ activated: nav === 'invitationsFriends' ? true : false }" 
					class="friends-request"
					@click="redirect('/friends/invitations')"
				>
					<b-icon icon="person-plus" class="icon"></b-icon>
					Lời mời kết bạn
				</div>
				<div 
					:class="{ activated: nav === 'findFriends' ? true : false }" 
					class="find-friends"
					@click="redirect('/friends/find')"
				>
					<b-icon icon="search" class="icon"></b-icon>
					Tìm kiếm bạn bè mới
				</div>
			</div>
		</div>
		<div class="section section--bottom">
			<div class="section__title">
				Online ({{countOnlineFriends}})
			</div>
			<div class="list-friends-online">
				<FriendOnlineItem
					v-for="(friend, index) in onlineFriends"
					:key="index"
					:friend="friend"
				></FriendOnlineItem>
			</div>
		</div>
	</div>
</template>

<script>
import FriendOnlineItem from '@/components/friendsPage/FriendOnlineItem'
import { mapGetters } from 'vuex'

export default {
	components: {
		FriendOnlineItem
	},

	computed: {
		...mapGetters({
			onlineFriends: 'onlineFriends'
		}),

		countOnlineFriends: function() {
			return this.onlineFriends.length
		},

		nav: function() {
			if( this.$route.path === '/friends' || this.$route.path === '/friends/' ) {
				return 'listFriends';
			} else if( this.$route.path === '/friends/invitations' 
								|| this.$route.path === '/friends/invitations/') {
				return 'invitationsFriends'
			} else if( this.$route.path === '/friends/find' 
								|| this.$route.path === '/friends/find/' ) {
				return 'findFriends'
			} else return 'notFound'
		}
	},

	data() {
		return {

		}
	},

	methods: {
		redirect(path) {
			if( path === this.$route.path ) return
			this.$router.push(path).catch(()=>{})
		}
	}
}
</script>

<style lang="scss" scoped>
.section {
	padding: 18px 0 0;

	&__title {
		margin-bottom: 18px;
		padding-left: 1.5rem;
	}

	&__categories {
		> div {
			padding: 1rem;
			padding-left: 1.5rem;
			font-size: 18px;
			cursor: pointer;

			&:hover {
				background-color: #091e4214 !important;
			}

			&.activated {
				background-color: #e4f0f6;
			}

			.icon {
				margin-right: 10px;
			} 
		}
	}
}

.section--top {
	border-bottom: 1px solid #dfdfdf;
}

.section--bottom {
	height: calc(100% - 238px);
	overflow-y: auto;

	.section__title {
		margin-bottom: .5rem;
	}

	.list-friends-online {
		margin-bottom: 6rem;
	}
}
</style>