<template>
	<div class="message-item" :class="{ self: message.from === userId }">
		<div class="main-message">
			<div v-if="message.to === userId" class="message-avatar">
				<img v-if="friendAvatar" :src="friendAvatar" alt="">
				<img v-else src="@/assets/img/anonymous.png" alt="">
			</div>
			<div 
				v-if="message.type === 'text'"
				class="message-content" 
				:class="{ self: message.from === userId }"
			>
				{{ message.content }}
			</div>
			<div 
				v-if="message.type === 'image'"
				class="message-content image"
				:class="{ self: message.from === userId }"
				@click="showImageModal"
			>
				<img :src="message.content" alt="">
			</div>
			<div 
				v-if="message.type === 'file'"
				class="message-content file"
				:class="{ self: message.from === userId }"
				@click="downloadFile"
			>
				<i class="fa-solid fa-file-arrow-down"></i>
				<span>{{ message.content }}</span>
				<a 
					ref="fileUrlDownload"
					:href="message.description" 
					:style="{ display: 'none' }"
				></a>
			</div>
		</div>
		<div class="time-ago" ref="timeAgo" :datetime="message.createdAt"></div>
	</div>
</template>

<script>
import ImageModal from './ImageModal'

import { format, render, register } from 'timeago.js'
import vieLocaleFunc from '@/helpers/timeAgoVie'

register('VN', vieLocaleFunc)

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
	},

	methods: {
		showImageModal() {
			this.$modal.show(
				ImageModal,
				{ 
					imageUrl: this.message.content,
					imageUrlDownload: this.message.description
				},
				{
					width: '80%',
					height: '95%'
				}
			)
		},

		downloadFile() {
			this.$refs.fileUrlDownload.click()
		}
	},

	mounted() {
		render(this.$refs.timeAgo, 'VN')
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

	.message-avatar {
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

		&.image {
			padding: 0;

			img {
				max-width: 300px;
				max-height: 300px;
				object-fit: cover;
				border: 1px solid #ddd;
				border-radius: 20px;
				cursor: pointer;

				&:hover {
					filter: brightness(90%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);
				}
			}
		}

		&.file {
			display: flex;
			align-items: center;
			cursor: pointer;

			i {
				flex-shrink: 0;
				width: 34px;
				height: 34px;
				font-size: 18px;
				line-height: 34px;
				text-align: center;
				margin-right: 12px;
				color: #466292;
				background-color: #d6d6d6;
				border-radius: 50%;
			}

			&:hover span {
				text-decoration: underline;
			}
		}
	}
}

.time-ago {
	color: #666;
	font-size: 12px;
	margin-top: 8px;
}
</style>
