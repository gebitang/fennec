import { CreateTransferPayload } from "@foxone/mixin-api/types";
import { defineComponent, toRefs, ref, computed, inject } from "vue";
import { v4 as uuid } from "uuid";
import Fennec from "@foxone/fennec-dapp/src";

export default defineComponent({
  name: "Transfer",

  props: {
    connected: Boolean
  },

  setup(props) {
    const { connected } = toRefs(props);
    const fennec = inject<Fennec>("fennec");
    const loading = ref(false);

    const meta = computed(() => {
      return {
        classes: `${loading.value ? "is-loading" : ""}`,
        text: ""
      };
    });

    const requestTransfer = async () => {
      loading.value = true;

      try {
        const payload: CreateTransferPayload = {
          amount: "100",
          asset_id: "965e5c6e-434c-3fa9-b780-c50f43cd955c", // CNB
          memo: "test",
          opponent_id: "5467e9ea-cd04-4b91-b84c-93a0c87cb6a4", // divisey
          trace_id: uuid()
        };

        await fennec?.ctx?.wallet.transfer(payload);
      } catch (error) {
        console.log(error);
      }

      loading.value = false;
    };

    return () => {
      if (!connected.value) {
        return "Please connect to extension";
      }

      return (
        <>
          <button
            class={"button is-small " + meta.value.classes}
            onClick={requestTransfer}
          >
            Transfer
          </button>
          <p class="my-3">{meta.value.text}</p>
        </>
      );
    };
  }
});
