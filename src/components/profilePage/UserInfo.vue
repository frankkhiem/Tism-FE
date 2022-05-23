<template>
	<div class="user-info">
		<div class="info-item link">
			<div class="info-label">
				<i class="fa-solid fa-mobile"></i>
				Số điện thoại:
			</div>
			<div class="info-value">
				(+84) 123 456 456
			</div>
		</div>
		<div class="info-item">
			<div class="info-label">
				<i class="fa-solid fa-cake-candles"></i>
				Ngày sinh:
			</div>
			<div class="info-value">
				01/01/2000
			</div>
		</div>
		<div class="info-item link">
			<div class="info-label">
				<i class="fa-solid fa-building"></i>
				Làm việc tại:
			</div>
			<div class="info-value">
				Tism Company.co
			</div>
		</div>
		<div class="info-item">
			<div class="info-label">
				<i class="fa-solid fa-graduation-cap"></i>
				Học vấn:
			</div>
			<div class="info-value">
				Cử nhân Hệ thống thông tin <span class="bold">Trường Đại học Công nghệ - ĐHQGHN</span>
			</div>
		</div>
		<div class="info-item">
			<div class="info-label">
				<i class="fa-solid fa-location-dot"></i>
				Địa chỉ:
			</div>
			<div class="info-value">
				Số <span class="bold">144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội</span>
			</div>
		</div>
		<div class="info-item">
			<div class="info-label">
				<i class="fa-solid fa-pen-to-square"></i>
				Mô tả:
			</div>
			<div class="info-value">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum quos perspiciatis fugiat ipsam sed illo corporis facere, cupiditate aut amet quis vitae neque blanditiis, doloremque sequi similique delectus ducimus id?
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters({
			user: 'profile'
		}),
	},

	created() {
		// console.log(this.$route.params.personId)
	}
}
</script>

<style lang="scss" scoped>
.user-info {
	margin-top: 3rem;
	padding: 0;
	padding-left: 2rem;
	padding-bottom: 3rem;

	.info-item {
		display: flex;
		margin-top: 1.5rem;

		.info-label {
			flex-basis: 170px;
			height: 24px;
			line-height: 24px;
			font-size: 16px;
			font-weight: 600;

			> i {
				width: 32px;
				font-size: 20px;
				text-align: center;
				color: #8c939d;
				margin-right: 4px;
				line-height: 24px;
			}
		}

		.info-value {
			flex-basis: 600px;
			padding-right: 2rem;

			span.bold {
				font-weight: 600;
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}
		}

		&.link {
			.info-value {
				color: #047dc4;
				flex-basis: fit-content;
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
