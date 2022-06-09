<template>
	<div class="find-friends">
		<div class="search">
			<b-icon icon="search" class="search-icon"></b-icon>
			<form @submit.prevent="searchFriends">
				<input 
					type="text" 
					ref="searchInput" 
					placeholder="Tìm kiếm bằng tên hoặc email" 
					v-model="searchKeyword"
				>	
			</form>
		</div>
		<div v-if="loading" class="search-loading">
			<img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
		</div>
		<div v-if="!loading && countResult" class="count">
			Tìm thấy {{ countResult }} kết quả
		</div>
		<div v-if="!loading && !countResult" class="count">
			Không có kết quả nào!
		</div>
		<div v-if="!loading" class="list">
			<FindResultItem 
				v-for="(person, index) in findResults" 
				:key="index"
				:friend="person"
			></FindResultItem>
		</div>
	</div>
</template>

<script>
import FindResultItem from './FindResultItem'
import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		FindResultItem
	},

	computed: {
		...mapGetters({
			findResults: 'allResultFindFriends'
		}),

		countResult: function() {
			return this.findResults.length
		}
	},

	data() {
		return {
			searchKeyword: '',
			loading: false
		}
	},

	methods: {
		...mapActions({
			resetFindFriends: 'resetFindFriends',
			searchFindFriends: 'searchFindFriends'
		}),

		async searchFriends() {
			const keyword = this.searchKeyword.trim()
			if( !keyword ) return
			this.$refs.searchInput.blur()
			try {
				this.loading = true
				// await new Promise(resolve => setTimeout(resolve, 500));
				await this.searchFindFriends(keyword)
				this.loading = false
			} catch(error) {
				// statements
				console.log(error);
			}
		}
	},

	created() {
		this.resetFindFriends()
	}
}
</script>

<style lang="scss" scoped>
.find-friends {
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