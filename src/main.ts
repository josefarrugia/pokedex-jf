/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'
import apolloClient from "../apollo-client";


// Components
import App from './App.vue'

// Composables
import {createApp, provide, h} from 'vue'
import {DefaultApolloClient} from '@vue/apollo-composable'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

registerPlugins(app)

app.mount('#app')
