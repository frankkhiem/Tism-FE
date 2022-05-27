<template>
	<div class="init-video-call">
		<div class="call-title">
			Đang gọi Video tới: 
			<span>{{ conversation.friendFullName }}</span>
		</div>
		<div class="call-remaining-time">
			Chờ phản hồi trong: 
			<span>{{ remainingTime }}s</span>
		</div>
		<div class="end-call" @click="endVideoCall">
			<div class="end-call-btn" v-b-tooltip.hover.bottom title="Hủy cuộc gọi">
        <b-icon class="action-icon" icon="telephone-x-fill"></b-icon>
      </div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import socket from '@/helpers/socketClient'

export default {
	props: {
		conversation: Object,
		setConnected: Function,
		setCallId: Function
	},

	computed: {
		...mapGetters({
			user: 'profile'
		})
	},

	data() {
		return {
			remainingTime: 20,
			callInfo: null
		}
	},

	methods: {
		...mapActions({
			playRingTone: 'playRingTone1',
			stopRingTone: 'stopRingTone1'
		}),

		countdown() {
			const intervalId = setInterval(() => {
				this.remainingTime -= 1
				if( this.remainingTime === 0 ) {
					clearInterval(intervalId)
					this.endVideoCall()
				}
			}, 1000)
		},

		endVideoCall() {
			this.$emit('close')
		},

		connectSuccess() {
			this.setConnected(true)
			this.$emit('close')
		},

		rejectCall() {
			this.setConnected(false)
			this.$emit('close')
		},

		handleDropConnectVideoCall(data) {
			if( data.id === this.conversation.friendId ) {
				socket.emit('reject-video-call', this.callInfo, true)
				this.rejectCall()
			}
		}
	},

	created() {		
		socket.emit('init-video-call', {
			conversationId: this.conversation.conversationId,
			caller: this.user.userId,
			callerName: this.user.fullname,
			receiver: this.conversation.friendId
		})

		socket.on('created-video-call', (callInfo) => {
			if( callInfo.conversationId === this.conversation.conversationId ) {
				this.callInfo = callInfo
				this.setCallId(callInfo.callId)
			}
		})

		socket.on('reject-video-call', (callInfo) => {
			if( callInfo.conversationId === this.conversation.conversationId ) {
				this.rejectCall()
			}
		})

		socket.on('accept-video-call', (callInfo) => {
			if( callInfo.conversationId === this.conversation.conversationId ) {
				this.connectSuccess()
			}
		})

		socket.on('friend-offline', this.handleDropConnectVideoCall)
	},

	mounted() {
		this.setConnected(null)
		this.setCallId(null)
		this.countdown()
		this.playRingTone()
	},

	destroyed() {
		this.stopRingTone()
		socket.off('reject-video-call')
		socket.off('accept-video-call')
		socket.off('friend-offline', this.handleDropConnectVideoCall)
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
	margin-top: 4px;
	font-size: 20px;
	font-weight: 600;

	span {
		color: #0e76c6;
		font-weight: 700;
	}
}

.call-remaining-time {
	font-size: 14px;
	margin-top: 4px;

	span {
		color: #c39a20;
		font-weight: 700;
	}
}

.end-call {
	margin-top: 1rem;
	width: fit-content;

	&-btn {
		width: 42px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 4px 0px rgba(0, 0, 0, .3);
		color: #fff;
    background-color: #f6382b;

    &:hover {
      filter: brightness(90%);
    }
	}
}
</style>
