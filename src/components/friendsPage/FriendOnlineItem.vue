<template>
	<div class="friend-item">
		<div class="friend-avatar" @click="toChat">
			<div v-if="friend.avatar" class="img-avatar">
				<img :src="friend.avatar" alt="">
			</div>
			<div v-else class="text-avatar">
				{{ friend.firstNameLetter }}
			</div>
		</div>
		<div class="friend-info">
			<div class="friend-name" @click="toChat">
				{{ friend.name }}
			</div>
			<div class="friend-actions">
				<b-icon icon="three-dots" class="three-dots" @click="showMore"></b-icon>
				<div 
					v-if="showMoreActions"
					v-click-outside-element="hideMore"
					class="actions-container"
				>
					<div class="action-item" @click="toProfile">
						Xem hồ sơ
					</div>
					<div class="action-item" @click="toChat">
						Nhắn tin
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		friend: Object
	},

	data() {
		return {
			showMoreActions: false
		}
	},

	methods: {
		toChat() {
			this.$router.push(`/chat/${this.friend.chatRoomId}`)
		},

		toProfile() {
			this.$router.push(`/person/${this.friend.id}/info`)
		},

		showMore() {
			setTimeout(() => {
				this.showMoreActions = true
			}, 0)
		},

		hideMore() {
			setTimeout(() => {
				this.showMoreActions = false
			}, 1)
		}
	}
}
</script>

<style lang="scss" scoped>
.friend-item {
	display: flex;
	align-items: center;
	padding: .6rem 1rem;

	&:hover {
		background-color: #091e4214
	}

	.friend-avatar {
		width: 45px;
		height: 45px;
		position: relative;
		cursor: pointer;

		.img-avatar {
			img {
				width: 45px;
				height: 45px;
				border-radius: 50%;
				object-fit: cover;
			}
		}

		.text-avatar {
			width: 100%;
			height: 100%;
			font-size: 18px;
			font-weight: 600;
			display: grid;
			place-items: center;
			border-radius: 50%;
			color: #fff;
			background-color: #999;
		}

		&:after {
			position: absolute;
			bottom: 0;
			right: 3px;
			content: "";
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background-color: #31a24c;
		}
	}

	.friend-info {
		margin-left: 1.2rem;
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.friend-name {
			flex-grow: 1;
			cursor: pointer;
			height: 45px;
			line-height: 45px;
			user-select: none;
		}

		.three-dots {
			visibility: hidden;
			color: #999;
			font-size: 1.2rem;
			margin-right: .5rem;
			cursor: pointer;

			&:hover {
				color: #555;
			}
		}

		.friend-actions {
			position: relative;
			cursor: pointer;

			.actions-container {
				position: absolute;
				bottom: 0;
				right: 0;
				transform: translate(10%, 100%);
				background-color: #fff;
				width: 120px;
				text-align: center;
				border: 1px solid #dfdfdf;
				border-radius: 10px;
				box-shadow: 0px 1px 4px 1px rgba(9, 30, 66, .15);
				z-index: 100;

				.action-item {
					padding: 8px 1rem;
					background-color: #fff;
					border-bottom: 1px solid #dfdfdf;

					&:hover {
						background-color: #091e4214;
					}

					&:last-child {
						border-bottom: none;
					}
				}
			}
		}
	}

	&:hover {
		.three-dots {
			visibility: visible;
		}
	}
}
</style>