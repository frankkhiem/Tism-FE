<template>
	<div class="init-video-call">
		<div class="call-title">
			Cuộc gọi Video từ:
			<span>{{ callInfo.callerName }}</span>
		</div>
		<div class="call-btns" >
			<div 
				class="reject-call-btn" 
				v-b-tooltip.hover.bottom title="Từ chối cuộc gọi"
				@click="rejectVideoCall"
			>
        <b-icon class="action-icon" icon="telephone-x-fill"></b-icon>
      </div>
      <div 
				class="accept-call-btn" 
				v-b-tooltip.hover.bottom title="Chấp nhận cuộc gọi"
				@click="acceptVideoCall"
			>
        <b-icon class="action-icon" icon="telephone-inbound-fill"></b-icon>
      </div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import socket from '@/helpers/socketClient'

export default {
	props: {
		callInfo: Object,
		setConnected: Function
	},

	computed: {
		...mapGetters({
			user: 'profile'
		})
	},

	data() {
		return {
			accept: null
		}
	},

	methods: {
		...mapActions({
			playRingTone: 'playRingTone2',
			stopRingTone: 'stopRingTone2'
		}),

		endVideoCall() {
			this.$emit('close')
		},

		connectSuccess() {
			this.$emit('close')
		},

		rejectVideoCall() {
			this.accept = false
			this.$emit('close')
		},

		acceptVideoCall() {
			this.accept = true
			this.$emit('close')
		},

		handleDropConnectVideoCall(data) {
			if( data.id === this.callInfo.caller ) {
				socket.emit('cancel-video-call', this.callInfo)
        this.$emit('close')
      }
		}
	},

	created() {
		this.setConnected(false)
		socket.on('cancel-video-call', (callInfo) => {
			if( callInfo.caller === this.callInfo.caller ) {
				this.$emit('close')
			}
		})
		socket.on('friend-offline', this.handleDropConnectVideoCall)
	},

	mounted() {
		this.playRingTone()
	},

	destroyed() {
		this.stopRingTone()
		socket.off('cancel-video-call')
		socket.off('friend-offline', this.handleDropConnectVideoCall)

		// đoạn if này cần đặt dưới cùng destroyed() vì có return theo điều kiện
		if( this.accept ) {
			socket.emit('accept-video-call', this.callInfo)
			this.setConnected(true)
		} else if( this.accept === null ) {
			return
		} else {
			socket.emit('reject-video-call', this.callInfo)
		}
	}
}
</script>

<style lang="scss" scoped>
.init-video-call {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items:center;
	padding: 1rem;
}

.call-title {
	margin-top: 6px;
	font-size: 20px;
	font-weight: 600;

	span {
		color: #0e76c6;
		font-weight: 700;
	}
}

.call-btns {
	display: flex;
	margin-top: 20px;

	> div {
		width: 42px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 4px 0px rgba(0, 0, 0, .3);
		color: #fff;
		margin: 0 1rem;

    &:hover {
      filter: brightness(90%);
    }
	}

	.reject-call-btn {
    background-color: #f6382b;
	}

	.accept-call-btn {
    background-color: #1768f6;
	}
}
</style>
