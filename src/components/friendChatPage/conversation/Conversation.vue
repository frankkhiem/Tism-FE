<template>
	<div class="conversation">
		<div v-show="false" class="page-loading">
			<img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
		</div>
		<ChatHeader 
			v-show="!loading"
			:conversation="conversationSelected"
			:initVideoCall="initVideoCall"
			@toggle-info="showInfo = ! showInfo"
			@initialed-video-call="initVideoCall = false"
		></ChatHeader>
		<Info 
			v-show="!loading && showInfo"
			:conversation="conversationSelected"
		></Info>
		<Messenger
			v-if="conversationSelected.messages"
			v-show="!loading && !showInfo"
			:totalMessages="conversationSelected.totalMessages"
			:messages="conversationSelected.messages"
			:friendAvatar="conversationSelected.friendAvatar"
			@init-video-call='initVideoCall = true'
		></Messenger>
	</div>
</template>

<script>
import ChatHeader from './Header'
import Messenger from './Messenger'
import Info from './Info'

import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		ChatHeader,
		Messenger,
		Info
	},

	computed: {
		...mapGetters({
			conversationSelected: 'conversationSelected'
		})
	},

	data() {
		return {
			loading: false,
			showInfo: false,
			initVideoCall: false
		}
	},

	methods: {
		...mapActions({
			getConversation: 'getConversation'
		}),

		async refreshConversation() {
			try {
				this.loading = true
				await this.getConversation(this.$route.params.chatRoomId)
				// await new Promise(resolve => setTimeout(resolve, 200))
				this.loading = false
			} catch(error) {
				this.$router.replace({ name: 'Not Found' })
			}
		}
	},

	created() {
		this.refreshConversation()
	},

	watch: {
		$route() {
			this.refreshConversation()
		}
	}
}
</script>

<style lang="scss" scoped>
.page-loading {
	height: 100%;
	display: grid;
	place-items: center;

	img {
		width: 60px;
		height: 60px;
	}
}
</style>
