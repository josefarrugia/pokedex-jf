<script lang="ts" setup>
import {useAppStore} from "@/stores/app";

const store = useAppStore();
</script>

<template>
  <v-dialog
    v-model="store.getShowDialog"
    max-width="320"
    persistent
  >
    <v-list
      class="py-2"
      color="primary"
      elevation="12"
      rounded="lg"
    >
      <v-list-item
        :prepend-icon="store.getDialogInfo.icon"
        :title="store.getDialogInfo.title"
      >
        <template v-slot:prepend>
          <div class="pe-4">
            <v-icon color="success" size="x-large"></v-icon>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
