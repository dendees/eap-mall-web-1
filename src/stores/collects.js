import { defineStore } from "pinia"

export const useCollectStore = defineStore("collect", {
    state: () => ({
        collects: [],
    }),
    actions: {
        init_collects(){
          this.collects = []
        },
        add_collects(item) {
          let collection = this.collects.find(c=>c.id == item.id)
          if(!collection){
            this.collects.push(item)
          }
        },
        remove_collects(item){
          let index = this.collects.findIndex(c=>c.id == item.id)
          if(index != -1){
            this.collects.splice(index,1)
          }
        }
    },
})