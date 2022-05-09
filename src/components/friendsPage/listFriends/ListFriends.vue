<template>
	<div class="list-friends">
		<div class="search">
			<b-icon icon="search" class="search-icon"></b-icon>
			<form @submit.prevent="searchFriends">
				<input type="text" ref="searchInput" placeholder="Tìm kiếm bạn bè" v-model="searchKeyword">	
			</form>
		</div>
		<div v-if="loading" class="search-loading">
			<img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
		</div>
		<div v-if="!loading && countFriends" class="count">
			Có {{ countFriends }} người bạn
		</div>
		<div v-if="!loading && !countFriends" class="count">
			Chưa có kết nối bạn bè nào!
		</div>
		<div v-if="!loading" class="list">
			<FriendItem 
				v-for="(friend, index) in friends" 
				:key="index"
				:friend="friend"
			></FriendItem>
		</div>
	</div>
</template>

<script>
import FriendItem from './FriendItem'
import { mapGetters } from 'vuex'

export default {
	components: {
		FriendItem
	},

	computed: {
		...mapGetters({
			friends: 'allFriends'
		}),

		countFriends: function() {
			return this.friends.length
		}
	},

	data() {
		return {
			searchKeyword: '',
			loading: false
		}
	},

	methods: {
		searchFriends() {
			console.log('Tim ban ' + this.searchKeyword)
			this.loading = true
			this.$refs.searchInput.blur()
			setTimeout(() => {
				this.loading = false
			}, 2000)
		}
	}
}
</script>

<style lang="scss" scoped>
.list-friends {
	height: calc(100% - 61px);
	padding: 0 2rem;
	overflow-y: auto;

	.search {
		position: relative;
		margin: 1rem auto 0;
		width: fit-content;

		.search-icon {
			position: absolute;
			top: 50%;
			left: 0;
			transform: translate(100%, -50%);
		}

		input {
			width: 400px;
			height: 36px;
			font-size: 16px;
			padding: 5px 8px 5px 42px;
			border-radius: 18px;
			border: none;
			outline: none;
			background-color: #f0f2f5;
		}
	}

	.search-loading {
		margin-top: 6rem;
		text-align: center;

		img {
			width: 70px;
			height: 70px;
		}
	}

	.count {
		margin: 1rem 2rem 1.5rem;
	}

	.list {
		padding-bottom: 5rem;
	}
}


</style>