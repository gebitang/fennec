<template>
  <f-panel :class="classes">
    <template v-for="(item, index) in items">
      <template v-if="item.show">
        <component
          :is="item.component"
          v-if="item.component"
          :key="index"
          :value="item.value"
          :title="item.title"
        />
        <information-item
          v-else
          :key="index"
          :title="item.title"
          :value="item.value"
          :copyable="item.copyable"
        />
      </template>
    </template>
  </f-panel>
</template>

<script lang="ts">
import { Ticker } from "@foxone/mixin-api/types";
import { Component, Prop, Vue } from "vue-property-decorator";
import SnapshotOpponent from "./SnapshotOpponent.vue";
import SnapshotProgress from "./SnapshotProgress.vue";
import { SnapshotMeta } from "../../utils/activity";

@Component({
  components: {
    SnapshotOpponent,
    SnapshotProgress
  }
})
class SnapshotDetails extends Vue {
  @Prop() snapshot!: SnapshotMeta;

  @Prop() createdPrice: Ticker | null = null;

  get classes() {
    const smAndDown = this.$vuetify.breakpoint.smAndDown;

    return { "snapshot--popup": smAndDown, "snapshot--desktop": !smAndDown };
  }

  get items() {
    const toFiat = this.$utils.currency.toFiat;
    const meta = this.snapshot as any;
    const {
      amount,
      amountFiat,
      createdAtText,
      memo,
      opponent_id,
      progress,
      receiver,
      sender,
      snapshot_id,
      text,
      transaction_hash,
      transaction_id,
      type
    } = meta;

    const priceThen = this.createdPrice?.price_usd ?? 0;
    const amountFiatThen = toFiat(this, { n: Math.abs(+amount) * +priceThen });
    const showFrom = type === "transfer" && +amount >= 0;
    const showTo = type === "transfer" && +amount < 0;
    const showSender = type !== "transfer" && +amount >= 0 && sender;
    const showReceiver = type !== "transfer" && +amount < 0 && receiver;

    return [
      {
        title: "Confirming",
        value: meta,
        show: !!progress,
        component: "snapshot-progress"
      },
      { title: "Value Now", value: amountFiat, show: true },
      {
        title: "Value Then",
        value: amountFiatThen,
        show: Boolean(this.createdPrice)
      },
      {
        title: "From",
        value: opponent_id,
        show: showFrom,
        component: "snapshot-opponent"
      },
      {
        title: "To",
        value: opponent_id,
        show: showTo,
        component: "snapshot-opponent"
      },
      { title: "Sender", value: sender, show: showSender },
      { title: "Receiver", value: receiver, show: showReceiver },
      { title: "Memo", value: memo, show: Boolean(memo), copyable: true },
      { title: "Date", value: createdAtText, show: true },
      { title: "Transaction Type", value: text, show: true },
      {
        title: "Snapshot Id",
        value: snapshot_id,
        show: !!snapshot_id,
        copyable: true
      },
      {
        title: "Transaction Id",
        value: transaction_id,
        show: !!transaction_id,
        copyable: true
      },
      {
        title: "Transaction Hash",
        value: transaction_hash,
        show: Boolean(transaction_hash),
        copyable: true
      }
    ];
  }
}
export default SnapshotDetails;
</script>

<style lang="scss" scoped>
.snapshot--popup {
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}
</style>
