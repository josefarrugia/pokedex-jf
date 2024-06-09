<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const store = useAppStore();

const name = ref("");
const favouritePokemonId = ref(null);

const GET_POKEMON_FAVOURITES = gql`
  query getPokemon($ids: [Int!], $name: String) {
    findPokemon: pokemon_v2_pokemon_aggregate(
      where: { name: { _ilike: $name } }
      limit: 10
    ) {
      items: nodes {
        id
        name
      }
    }

    pokemonFavourites: pokemon_v2_pokemon_aggregate(
      where: { id: { _in: $ids } }
    ) {
      items: nodes {
        id
        name
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
      }
    }
  }
`;

const { result } = useQuery(GET_POKEMON_FAVOURITES, () => ({
  ids: store.getFavourites,
  name: `%${name.value}%`,
  notifyOnNetworkStatusChange: true,
}));

const getPokemonFavourites = computed(
  () => result.value?.pokemonFavourites?.items,
);
const getPokemonSearchResults = computed(
  () => result.value?.findPokemon?.items,
);

const handleRemovePokemon = (pokemonId: number, name: string) => {
  store.removeFavourite(pokemonId, name);
};

const handleAddFavourite = () => {
  if (favouritePokemonId.value === null) return;

  // @TODO: Add Pokemon name
  store.addFavourite(favouritePokemonId.value, "Pokemon");
  favouritePokemonId.value = null;
};
</script>

<template>
  <v-container>
    <!-- Add Favourite Pokemon-->
    <v-autocomplete
      clearable
      label="Add Pokemon to Favourites"
      :items="getPokemonSearchResults"
      :item-title="(item) => item.name"
      :item-value="(item) => item.id"
      variant="solo-filled"
      hint="Click the icon to save to favourites"
      v-model="favouritePokemonId"
    >
      <template v-slot:append>
        <v-icon
          color="success"
          icon="mdi-heart-plus"
          @click="handleAddFavourite"
          :disabled="favouritePokemonId === null"
        ></v-icon>
      </template>
      <template v-slot:append-item>
        <v-list-item>
          <small>...</small>
        </v-list-item>
      </template>
    </v-autocomplete>

    <v-row>
      <v-col
        v-for="pokemon in getPokemonFavourites"
        :key="pokemon.id"
        cols="12"
        md="3"
      >
        <v-card class="mx-auto" :title="pokemon.name" variant="outlined">
          <template v-slot:subtitle>
            <div class="d-flex ga-2">
              <v-chip
                v-for="item in pokemon.types"
                :key="item.id"
                variant="outlined"
                size="small"
                :ripple="false"
              >
                {{ item.type.name }}
              </v-chip>
            </div>
          </template>
          <template v-slot:prepend>
            <v-avatar
              :image="pokemon.avatar[0]?.sprites?.other?.home?.front_shiny"
              size="48"
            ></v-avatar>
          </template>
          <template v-slot:append>
            <v-icon
              color="success"
              icon="mdi-heart-minus"
              @click="handleRemovePokemon(pokemon.id, pokemon.name)"
            ></v-icon>
          </template>
          <template v-slot:actions>
            <RouterLink
              :to="{ name: '/pokemon/[id]', params: { id: pokemon.id } }"
            >
              <v-btn prepend-icon="mdi-eye-outline" variant="tonal">
                View Pokemon
              </v-btn>
            </RouterLink>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
