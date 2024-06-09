<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/app";

const route = useRoute();
const store = useAppStore();

const pokemonId = ref(0);
const tab = ref(null);
const tabHeaders = ref([
  {
    text: "about",
    value: "about",
  },
  {
    text: "stats",
    value: "stats",
  },
]);

const GET_POKEMON_DETAIL = gql`
  query getPokemonDetail($id: Int) {
    pokemon: pokemon_v2_pokemon_aggregate(
      where: { id: { _eq: $id } }
      limit: 1
    ) {
      items: nodes {
        id
        name
        height
        weight
        abilities: pokemon_v2_pokemonabilities {
          ability: pokemon_v2_ability {
            name
          }
        }
        types: pokemon_v2_pokemontypes {
          type: pokemon_v2_type {
            name
            id
          }
        }
        avatar: pokemon_v2_pokemonsprites {
          pokemon_id
          sprites
        }
        stats: pokemon_v2_pokemonstats {
          base_stat
          effort
          id
          stat_id
          pokemon_v2_stat {
            name
          }
        }
      }
    }
  }
`;
const { result } = useQuery(GET_POKEMON_DETAIL, () => ({
  id: pokemonId.value,
}));

const getPokemon = computed(() => result.value?.pokemon?.items[0]);
const getPokemonAvatar = computed(
  () => getPokemon.value?.avatar[0]?.sprites?.other?.home?.front_shiny,
);
const getPokemonStats = computed(() => getPokemon.value?.stats);

const getPokemonHeight = computed(() => getPokemon.value.height / 10);
const getPokemonWeight = computed(() => getPokemon.value.weight / 10);

const getStatsColour = (stat: string) => {
  switch (stat) {
    case "hp":
      return "blue";

    case "attack":
      return "red";

    case "defense":
      return "green";

    case "special-attack":
      return "red-accent-2";

    case "special-defense":
      return "blue-accent-2";

    case "speed":
      return "amber";

    default:
      return "blue-grey";
  }
};

watch(
  () => route.params.id,
  (newId) => {
    pokemonId.value = Number(newId);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <v-container>
    <v-card v-if="getPokemon" class="mx-auto" max-width="400">
      <template v-slot:append>
        <v-icon
          color="red"
          icon="mdi-heart"
          @click="store.addFavourite(getPokemon.id, getPokemon.name)"
        ></v-icon>
      </template>
      <div class="d-flex justify-center">
        <v-avatar
          :image="getPokemonAvatar"
          size="200"
          class="bg-grey-lighten-3 pa-4 mb-4"
        ></v-avatar>
      </div>
      <h1 class="text-center">{{ getPokemon.name }}</h1>
      <v-tabs v-model="tab" bg-color="red">
        <v-tab v-for="header in tabHeaders" :key="header.value">
          {{ header.text }}
        </v-tab>
      </v-tabs>

      <v-card-text>
        <!-- Tabs -->
        <v-tabs-window v-model="tab">
          <!-- About -->
          <v-tabs-window-item value="about">
            <v-list lines="two">
              <v-list-subheader>Types</v-list-subheader>
              <div class="d-flex ml-4 ga-2">
                <v-chip
                  v-for="item in getPokemon.types"
                  :key="item.id"
                  variant="outlined"
                  size="small"
                  :ripple="false"
                  label
                  :disabled="false"
                >
                  {{ item.type.name }}
                </v-chip>
              </div>
            </v-list>

            <v-list lines="two">
              <v-list-subheader>Abilities</v-list-subheader>
              <div class="d-flex ml-4 ga-2">
                <v-chip
                  v-for="item in getPokemon.abilities"
                  :key="item.id"
                  variant="outlined"
                  size="small"
                  :ripple="false"
                  label
                >
                  {{ item.ability.name }}
                </v-chip>
              </div>
            </v-list>

            <v-divider class="mt-4"></v-divider>

            <v-list lines="two">
              <v-list-subheader>Vital Stats</v-list-subheader>

              <div class="d-flex">
                <v-list-item
                  title="Height (m)"
                  :subtitle="getPokemonHeight"
                ></v-list-item>

                <v-list-item
                  title="Weight (kg)"
                  :subtitle="getPokemonWeight"
                ></v-list-item>
              </div>
            </v-list>
          </v-tabs-window-item>

          <!-- Stats -->
          <v-tabs-window-item value="stats">
            <div class="d-flex flex-column ga-4">
              <div v-for="(stat, index) in getPokemonStats" :key="index">
                <h3>{{ stat.pokemon_v2_stat.name }}</h3>
                <v-progress-linear
                  :model-value="stat.base_stat"
                  :color="getStatsColour(stat.pokemon_v2_stat.name)"
                >
                </v-progress-linear>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
h1 {
  text-transform: capitalize;
}

h3 {
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
