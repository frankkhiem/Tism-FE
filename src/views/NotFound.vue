<template>
	<div class="not-found-page">
		<div class="not-found-gif">
			<img src="@/assets/img/error 404.gif" alt="">
		</div>
		<div class="not-found-message">
			Trang không được tìm thấy!
		</div>
		<div class="home-link">
			<router-link to="/" class="home-link-btn">Về trang chủ</router-link>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.not-found-page {
	height: 100vh;

	.not-found-gif {
		text-align: center;

		img {
			height: 400px;
		}
	}

	.not-found-message {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 2rem;
		font-weight: 700;
	}

	.home-link {
		margin-top: 1rem;
		text-align: center;

		&-btn {
			display: inline-block;
			padding: 5px 3rem;
			color: #fff;
			background-color: #6b77bf;
			border-radius: 6px;
			font-size: 18px;
			font-weight: 700;
			text-decoration: none;
			transition: background-color .2s linear;

			&:hover {
        background-color: #026aa7;
      }
		}
	}
}
</style>