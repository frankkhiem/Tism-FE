<template>
	<div class="conversation">
		<Header 
			:conversation="conversationSelected"
			@toggle-info="showInfo = ! showInfo"
		></Header>
		<Info 
			v-if="showInfo"
			:conversation="conversationSelected"
		></Info>
		<Messenger 
			v-else
			:messages="conversationSelected.messages"
			:friendAvatar="conversationSelected.friendAvatar"
		></Messenger>
	</div>
</template>

<script>
import Header from './Header'
import Messenger from './Messenger'
import Info from './Info'

import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		Header,
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
			showInfo: false
		}
	},

	methods: {
		...mapActions({
			getConversation: 'getConversation'
		}),

		async refreshConversation() {
			await this.getConversation(this.$route.params.chatRoomId)
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
	
</style>
