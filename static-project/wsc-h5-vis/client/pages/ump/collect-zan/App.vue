<template>
  <layout-zan :class="{ 'is-android': isAndroid }" :inited="inited">
    <block-rules slot="rules" />
    <block-progress slot="progress" />
    <block-reward slot="reward" />
    <block-actions slot="actions" />
    <block-records slot="records" />
    <block-poster />
    <block-host-dialog />
    <block-guest-dialog />
  </layout-zan>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LayoutZan from './components/LayoutZan';
import BlockRules from './blocks/Rules';
import BlockProgress from './blocks/Progress';
import BlockReward from './blocks/Reward';
import BlockActions from './blocks/Actions';
import BlockRecords from './blocks/Records';
import BlockPoster from './blocks/Poster';
import BlockHostDialog from './blocks/HostDialog';
import BlockGuestDialog from './blocks/GuestDialog';

export default {
  name: 'collect-zan',

  components: {
    LayoutZan,
    BlockRules,
    BlockProgress,
    BlockReward,
    BlockActions,
    BlockRecords,
    BlockPoster,
    BlockHostDialog,
    BlockGuestDialog,
  },

  computed: {
    ...mapState(['inited', 'isAndroid']),
  },

  created() {
    this.initState();
  },

  methods: {
    ...mapActions(['initState']),
  },
};
</script>
