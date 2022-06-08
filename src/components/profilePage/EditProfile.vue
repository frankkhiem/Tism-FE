<template>
	<div v-if="loading" class="edit-profile loading-update">
		<img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
	</div>
	<div v-else class="edit-profile">
		<div class="properties">
			<div class="property fullname">
				<label for="fullname-input">Họ và tên:</label>
				<input id="fullname-input" type="text" class="property__input" v-model="fullname">
			</div>
			<div class="notification">
				Tính năng cập nhật các thông tin khác của người dùng đang được bảo trì!
			</div>
		</div>
		<div class="btns">
			<div class="cancel-btn" @click="cancelUpdateProfile">
				Hủy
			</div>
			<div class="update-btn" @click="updateProfile">
				Cập nhật
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters({
			user: 'profile'
		})
	},

	data() {
		return {
			fullname: '',
			loading: false
		}
	},

	methods: {
		...mapActions({
			updateUserFullname: 'updateUserFullname'
		}),

		async updateProfile() {
			if( this.fullname.trim() === '' ) {
				this.$confirm(
          {
            title: `Cập nhật thất bại`,
            message: `Họ tên không thể để trống!`,
            button: {
              no: 'Đã hiểu',
            }
          }
        )
        this.fullname = this.user.fullname
        return
			}
			try {
				this.loading = true
				await this.updateUserFullname(this.fullname.trim())
				this.loading = false
				this.$router.push({ name: 'Profile' })
			} catch(e) {
				console.log(e);
			}
		},

		cancelUpdateProfile() {
			this.$router.push({ name: 'Profile' })
		}
	},

	created() {
		this.fullname = this.user.fullname
	}
}
</script>

<style lang="scss" scoped>
.edit-profile {
	height: calc(100% - 50px - 3rem);
	margin-top: 3rem;
	padding: 0;
	padding-left: 2rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	&.loading-update {
		justify-content: center;
		align-items: center;

		img {
			width: 80px;
			height: 80px;
			transform: translateY(-50%);
		}
	}
}

.properties {
	.property {
		label {
			display: block;
			font-size: 18px;
			font-weight: 600;
		}

		&__input {
			display: block;
			width: 400px;
			height: 36px;
			padding: 4px 1rem;
			font-size: 16px;
			font-weight: 600;
			outline: none;
			border: 1px solid #bbb;
			border-radius: 6px;
		}
	}

	.notification {
		margin-top: 3rem;
		font-weight: 600;
	}
}

.btns {
	display: flex;
	justify-content: center;
	margin-bottom: 2rem;

	> div {
		height: 38px;
		line-height: 38px;
		padding: 0 16px;
		border-radius: 4px;
		text-align: center;
		user-select: none;
		cursor: pointer;
	}

	.cancel-btn:hover {
		background-color: #85dadf2f;
	}

	.update-btn {
    margin-left: 1rem;
    color: #fff;
    background-color: #4bcb50;

    &:hover {
      background-color: #46b04a;
    }
  }
}
</style>
