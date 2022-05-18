<template>
	<div class="message-item" :class="{ self: message.from === userId }">
		<div class="main-message">
			<div v-if="message.to === userId" class="message-image">
				<img v-if="friendAvatar" :src="friendAvatar" alt="">
				<img v-else src="@/assets/img/anonymous.png" alt="">
			</div>
			<div class="message-content" :class="{ self: message.from === userId }">
				{{ message.content }}
			</div>
		</div>
		<div class="time-ago">
			{{ timeago }}
		</div>
	</div>
</template>

<script>
import { format } from 'timeago.js'

export default {
	props: {
		message: {
			type: Object
		},
		friendAvatar: {
			type: String
		},
		userId: {
			type: String
		}
	},

	computed: {
		timeago() {
			return format(this.message.createdAt)
		}
	},

	data() {
		return {
			
		}
	}
}
</script>

<style lang="scss" scoped>
.message-item {
	margin: 1.5rem 1.5rem 0;
	display: flex;
	flex-direction: column;

	&:first-child {
		margin-top: 0;
	}

	&.self {
		align-items: flex-end;
	}
}

.main-message {
	display: flex;
	align-items: center;

	.message-image {
		width: 28px;
		height: 28px;

		img {
			width: inherit;
			height: inherit;
			border-radius: 50%;
			object-fit: cover;
		}
	}

	.message-content {
		max-width: 500px;
		margin-left: 12px;
		padding: .5rem 1rem;
		font-size: 16px;
		border-radius: 20px;
		text-align: left;
		color: inherit;
		background-color: #ebe6eb;

		&.self {
			color: #fff;
			background-color: #0084ff;
		}
	}
}

.time-ago {
	color: #666;
	font-size: 12px;
	margin-top: 8px;
}
</style>
