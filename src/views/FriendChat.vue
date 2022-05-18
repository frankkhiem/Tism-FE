<template>
	<div id="friend-chat-page">
		<SubSidebar></SubSidebar>
		<Conversation v-if="inConversation"></Conversation>
		<div v-else class="out-conversation">
			Hãy chọn cuộc trò chuyện của bạn!
		</div>
	</div>
</template>

<script>
import SubSidebar from '@/components/friendChatPage/subSidebar/SubSidebar'
import Conversation from '@/components/friendChatPage/conversation/Conversation'

import { mapActions } from 'vuex'

export default {
	components: {
		SubSidebar,
		Conversation
	},

	computed: {
		inConversation() {
			if( this.$route.params.chatRoomId ) {
				return true
			}
			return false
		}
	},

	methods: {
		...mapActions({
			getListConversations: 'getListConversations'
		})
	},

	async created() {
		// console.log('chattttt')
		try {
			await this.getListConversations()
		} catch(error) {
			console.log(error);
		}
	}
}
</script>

<style lang="scss" scoped>
#friend-chat-page {
	display: flex;
	min-height: inherit;
  height: calc(100vh - 58px - 80px - 0rem);

	.sub-sidebar {
		height: inherit;
		flex-basis: 340px;
		border-right: 1px solid #dfdfdf;
		box-shadow: 2px 0px 6px -3px rgba(9, 30, 66, .2);
	}

	.conversation {
		flex-grow: 1;
		height: inherit;
	}

	.out-conversation {
		height: inherit;
		flex-grow: 1;
		display: grid;
		place-items: center;
		text-align: center;
		font-size: 36px;
		font-weight: 700;
		color: #c6c6c6;
	}
}
</style>
