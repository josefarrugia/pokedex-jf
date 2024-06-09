<template>
  <v-app>
    <v-layout>
      <AppHeader />

      <v-main>
        <router-view />
      </v-main>
    </v-layout>

    <AppDialog />
    <AppFooter />
  </v-app>
</template>
