// Utilities
import { defineStore } from "pinia";
import findIndex from "@/utils/find-index";

export const useAppStore = defineStore("app", {
  state: () => ({
    favourites: [],
    showDialog: false,
    dialogInfo: {
      title: "",
      icon: "",
    },
  }),

  getters: {
    getFavourites: (state) => state.favourites,
    getShowDialog: (state) => state.showDialog,
    getDialogInfo: (state) => state.dialogInfo,
  },

  actions: {
    addFavourite(pokemonId: number, name: string) {
      const index = findIndex(this.favourites, pokemonId);

      if (index === -1) {
        this.favourites.push(pokemonId);
        this.setShowDialog(`Added ${name}`, "mdi-heart");
      } else {
        console.error("Pokemon already exists");
        this.setShowDialog(
          "Pokemon already exists",
          "mdi-alert-circle-outline",
        );
        return;
      }
    },

    removeFavourite(pokemonId: number, name: string) {
      const index = this.favourites.findIndex((id) => id === pokemonId);

      if (index !== -1) {
        this.favourites.splice(index, 1);
        this.setShowDialog(`Removed ${name}`, "mdi-heart-minus");
      } else {
        console.error("Can not find Pokemon");
        this.setShowDialog("Can not find Pokemon", "mdi-alert-circle-outline");
        return;
      }
    },

    setShowDialog(title: string, icon?: string) {
      this.dialogInfo.title = title;
      if (icon) this.dialogInfo.icon = icon;

      this.showDialog = true;
      setTimeout(() => (this.showDialog = false), 1250);
    },
  },
});
