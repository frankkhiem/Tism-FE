<template>
	<div>
		<div class="section section--top">
			<div class="section__title">
				Danh mục
			</div>
			<div class="section__categories">
				<div class="find-friends actived">
					Tìm kiếm bạn bè
				</div>
				<div class="friends-request">
					Lời mời kết bạn
				</div>
				<div class="friends-list">
					Danh sách bạn bè
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	
</script>

<style lang="scss" scoped>
.section {
	padding: 1rem 0;

	&__title {
		margin-bottom: 1rem;
		padding-left: 1rem;
	}

	&__categories {
		> div {
			padding: .6rem 1rem;
			font-size: 18px;
			cursor: pointer;

			&:hover {
				background-color: #091e4214;
			}

			&.actived {
				background-color: #e4f0f6;
			}
		}
	}
}
</style>