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
	height: inherit;
	display: flex;

	.team-members {
		flex-basis: 300px;
		background-color: #fffdfa;
		flex-shrink: 0;
	}

	.team-chatbox {
		flex-grow: 1;
		background-color: #fffdfa;
	}
}
</style>
