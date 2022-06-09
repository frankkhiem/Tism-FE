<template>
	<div class="invitations-friends">
		<div class="page-nav">
			<div 
				class="invitations-received" 
				:class="{ activated: type === 'received' }"
				@click="type = 'received'"
			>
				Lời mời nhận được
			</div>
			<div 
				class="invitations-sended" 
				:class="{ activated: type === 'sended' }"
				@click="type = 'sended'"
			>
				Lời mời đã gửi
			</div>
		</div>	
		<div v-if="loading" class="page-loading">
			<img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
		</div>
		<div v-if="!loading && type === 'received'" class="invitations-received">
			<div v-if="countReceived" class="count">
				Có {{ countReceived }} lời mời kết bạn
			</div>
			<div v-else class="count">
				Bạn chưa nhận được lời mời kết bạn nào!
			</div>
			<div class="list">
				<ReceivedItem
					v-for="(person, index) in friendsInvitationsReceived" 
					:key="index"
					:friend="person"
					@refresh-invitations="refreshInvitaions"
				></ReceivedItem>
			</div>
		</div>
		<div v-if="!loading && type === 'sended'" class="invitations-sended">
			<div v-if="countSended" class="count">
				Đã gửi {{ countSended }} yêu cầu kết bạn
			</div>
			<div v-else class="count">
				Bạn chưa gửi lời mời kết bạn nào!
			</div>
			<SendedItem
				v-for="(person, index) in friendsInvitationsSended" 
				:key="index"
				:friend="person"
				@refresh-invitations="refreshInvitaions"
			></SendedItem>
		</div>
	</div>
</template>

<script>
import ReceivedItem from './ReceivedItem'
import SendedItem from './SendedItem'
import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		ReceivedItem,
		SendedItem
	},

	computed: {
		...mapGetters({
			friendsInvitationsReceived: 'friendsInvitationsReceived',
			friendsInvitationsSended: 'friendsInvitationsSended'
		}),

		countReceived: function() {
			return this.friendsInvitationsReceived.length
		}, 

		countSended: function() {
			return this.friendsInvitationsSended.length
		}
	},

	data() {
		return {
			type: 'received',
			loading: false
		}
	},

	methods: {
		...mapActions({
			getListFriends: 'getListFriends',
			getInvitationsReceived: 'getInvitationsReceived',
			getInvitationsSended: 'getInvitationsSended'
		}),

		async refreshInvitaions() {
			try {
				this.loading = true;
				// await new Promise(resolve => setTimeout(resolve, 500));
				await this.getInvitationsReceived()
				await this.getInvitationsSended()
				await this.getListFriends()
				this.loading = false;
			} catch(error) {
				console.log(error);
			}
		}
	},

	async created() {
		this.refreshInvitaions()
	}
}
</script>

<style lang="scss" scoped>
.invitations-friends {
	height: calc(100% - 61px);
	padding: 0 2rem;
	overflow-y: auto;

	.page-nav {
		display: flex;
		justify-content: center;
		align-items: center;

		> div {
			margin: 1rem 12px;
			padding: 5px 2rem;
			background-color: #fff;
			// border: 1px solid #aaa;
			border-radius: 8px;
			font-size: 14px;
			font-weight: 600;
			box-shadow: 0px 1px 3px 1px rgba(9, 30, 66, .25);
			cursor: pointer;
			transition: all .1s linear;
			user-select: none;

			&:hover {
				background-color: #f4f5fd;
			}

			&.activated {
				color: #fff;
				background-color: #1b74e4;
			}
		}
	}

	.page-loading {
		margin-top: 6rem;
		text-align: center;

		img {
			width: 70px;
			height: 70px;
		}
	}

	.count {
		margin: 0rem 2rem 1.5rem;
	}

	.list {
		padding-bottom: 5rem;
	}
}
</style>