import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    lang: "ja",
    currency: "CNY",
    langs: [
      {
        key: "ja",
        label: "にほんご",
      },
      {
        key: "zhCn",
        label: "简体中文",
      },
      {
        key: "zhTw",
        label: "繁體中文",
      },
      {
        key: "en",
        label: "English",
      },
    ],
    currencys: [
      {
        key: "CNY",
        label: "人民币",
        sign: "¥",
        rate: "0.05",
      },
      {
        key: "JPY",
        label: "日元",
        sign: "円",
        rate: "1",
      },
      {
        key: "USD",
        label: "美元",
        sign: "$",
        rate: "0.0082",
      },
      {
        key: "HKD",
        label: "港币",
        sign: "HK$",
        rate: "0.045",
      },
    ],
  }),
  actions:{
    setLang(lang){
      this.lang = lang
    },
    setCurrency(currency){
      this.currency = currency
    }
  }
});
