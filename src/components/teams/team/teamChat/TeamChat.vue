<template>
	<div class="team-chat">
		<TeamMembers></TeamMembers>
		<TeamChatbox></TeamChatbox>
	</div>
</template>

<script>
import TeamMembers from './TeamMembers'
import TeamChatbox from './TeamChatbox'

export default {
	components: {
		TeamMembers,
		TeamChatbox
	}
}
</script>

<style lang="scss" scoped>
.team-chat {
	height: calc(100vh - 58px - 168px);
	width: calc(100vw - 64px);
	display: flex;

	.team-members {
		flex-basis: 300px;
		background-color: #fff;
		border-radius: 6px;
		flex-shrink: 0;
	}

	.team-chatbox {
		flex-grow: 1;
		//background-color: #fff;
	}
}
</style>
