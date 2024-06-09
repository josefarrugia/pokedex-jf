<script lang="ts" setup>
import {useRouter} from "vue-router";

const router = useRouter();

const drawer = ref(false);
</script>

<template>
  <v-app-bar
    color="red"
  >
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <v-toolbar-title>Pokedex–<small>JF</small></v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon="mdi-home-variant-outline" variant="text" @click="router.push({ name: '/'})"></v-btn>
    <v-btn icon="mdi-tag-heart-outline" variant="text" @click="router.push({ name: '/pokemon/favourites'})"></v-btn>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    location="left"
    temporary
  >
    <v-list>
      <v-list-item prepend-icon="mdi-home-variant-outline" title="Home" value="home" :to="{ name: '/'}"></v-list-item>
      <v-list-item prepend-icon="mdi-tag-heart-outline" title="Favourites" value="favourites"
                   :to="{ name: '/pokemon/favourites'}"></v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>
