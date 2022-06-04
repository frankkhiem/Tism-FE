<template>
	<div 
		class="notification-item" 
		:class="{ unseen: !seen }"
	>
		<img v-if="image" :src="image" alt="">
		<img v-else :src="require(`@/assets/img/${aliasImage}`)" alt="">
		<div class="notification-content">
			<div class="notification-title">
				{{ title }}
			</div>
			<div class="notification-description">
				<span v-show="topHighlight" class="highlight-description">{{ topHighlight }}</span>
				{{ description }}
				<span v-show="bottomHighlight" class="highlight-description">{{ bottomHighlight }}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		type: String,
		image: String,
		title: String,
		description: String,
		topHighlight: String,
		bottomHighlight: String,
		seen: Boolean
	},

	computed: {
		aliasImage() {
			if( this.type === 'friend' ) {
				return 'anonymous.png'
			} else if( this.type === 'team' ) {
				return 'team-tree.png'
			} else {
				return 'Tism-logo.png'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.notification-item {
	display: flex;
	align-items: center;
	height: 60px;
	padding: 5px .5rem;
	margin: 0 .5rem 1rem;
	background-color: #fff;
	border-radius: 4px;
	transition: background-color .1s linear;
	cursor: pointer;
	position: relative;

	&.unseen {
		background-color: #e2e2e2;

		&:hover {
			background-color: #d6d6d6;
		}
	}

	&:hover {
		background-color: #f6f6f6;
	}

	&::after {
		position: absolute;
		top: calc(100% + .5rem);
		left: 50%;
		content: "";
		width: calc(100% - 1rem);
		transform: translateX(-50%);
		border-bottom: 1px solid #eee;
	}

	img {
		width: 50px;
		height: 50px;
		object-fit: cover;
		// border: 1px solid #bbb;
		border-radius: 3px;
	}

	.notification-content {
		margin-left: 10px;
	}

	.notification-title {
		font-size: 15px;
		font-weight: 600;
	}

	.notification-description {
		font-size: 13px;
		color: #787e86;
		line-height: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;

		.highlight-description {
			color: #2185d0;
			font-size: 14px;
			font-weight: 700;
		}
	}
}
</style>
