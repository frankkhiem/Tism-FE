<template>
	<div class="member-item" :class="{ self: self }" @click="toProfile">
		<div class="member-avatar">
			<div v-if="member.avatar" class="img-avatar">
				<img :src="member.avatar" alt="">
			</div>
			<div v-else class="text-avatar">
				{{ member.firstNameLetter }}
			</div>
		</div>
		<div class="member-info">
			<div class="member-name">
				{{ member.name }}
			</div>
			<div v-show="self" class="self-name">
				<span>🟣</span> Bạn
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		member: Object,
		self: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			
		}
	},

	methods: {
		toProfile() {
			if( this.self ) {
				this.$router.push({ name: 'Profile' })
			} else {
				this.$router.push({
					name: 'PersonInfo',
					params: {
						personId: this.member.id
					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.member-item {
	display: flex;
	align-items: center;
	padding: .6rem 1rem;
	border-radius: 5px;
	cursor: pointer;

	&:hover {
		background-color: #091e4214
	}

	&.self {
		background-color: #eaf3ff;
	}

	.member-avatar {
		width: 45px;
		height: 45px;
		position: relative;

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
	}

	.member-info {
		margin-left: 1.2rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		.member-name {
			flex-grow: 1;
			font-size: 14px;
			font-weight: 600;
			user-select: none;
		}

		.self-name {
			font-size: 14px;

			span {
				font-size: 11px;
			}
		}
	}
}
</style>