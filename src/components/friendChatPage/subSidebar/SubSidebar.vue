<template>
	<div class="sub-sidebar">
		<div class="page-title">
			<div class="title-name" @click="toChatPage">
				Chat
			</div>
			<div class="title-btns">
				<div class="title-btn">
					<i class="fa-solid fa-pen-to-square"></i>
				</div>
				<div class="title-btn">
					<i class="fa-solid fa-user-group"></i>
				</div>
				<div class="title-btn">
					<i class="fa-solid fa-ellipsis"></i>
				</div>
			</div>
		</div>
		<div class="searchbar">
			<label for="search-conversation">
				<b-icon icon="search" class="icon" scale="1"></b-icon>
			</label>
			<input id="search-conversation" type="text" placeholder="Tìm kiếm cuộc trò chuyện">
		</div>
		<div class="list-chatrooms">
			<ChatRoom 
				v-for="conversation in conversations" 
				:key="conversation.conversationId"
				:conversation="conversation"
			></ChatRoom>
		</div>
	</div>
</template>

<script>
import ChatRoom from './ChatRoom'
import { mapGetters } from 'vuex'

export default {
	components: {
		ChatRoom
	},

	computed: {
		...mapGetters({
			conversations: 'listConversations'
		})
	},

	methods: {
		toChatPage() {
			if( this.$route.name !== 'FriendChatDefault' ) {
				this.$router.push({ name: 'FriendChatDefault' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.sub-sidebar {
	display: flex;
	flex-direction: column;
}

.page-title {
	height: 60px;
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.title-name {
		font-size: 28px;
		color: #252525;
		font-weight: 700;
		margin-left: 1rem;
		cursor: pointer;
	}

	.title-btns {
		display: flex;
		margin-right: 1rem;

		.title-btn {
			margin-left: 10px;
			width: 36px;
			height: 36px;
			line-height: 36px;
			border-radius: 50%;
			background-color: #e4e6eb;
			text-align: center;
			font-size: 18px;
			// color: #2c2c2c;
			cursor: pointer;

			&:hover {
				background-color: #d1d2d6;
			}
		}
	}
}

.searchbar {
	text-align: center;
	flex-shrink: 0;
	margin: 0 1rem 1.6rem;
	position: relative;

	.icon {
		position: absolute;
		height: 36px;
		top: 50%;
		left: 1rem;
		transform: translateY(-50%);
		cursor: pointer;
	}

	input {
		width: 100%;
		height: 36px;
		border: none;
		border-radius: 18px;
		outline: none;
		padding: 6px;
		padding-left: 40px;
		color: inherit;
		background-color: #f0f2f5;

		&:focus {
			box-shadow: 0 0 1px 1px rgba(0, 0, 0, .2);
		}
	}
}

.list-chatrooms {
	flex-grow: 1;
	padding-bottom: 4rem;
	// border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	overflow-y: auto;
}
</style>
