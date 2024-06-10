<script lang="ts" setup>
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";
import type { PokemonType } from "@/types/PokemonType.interface";

const store = useAppStore();
const router = useRouter();

const itemsPerPage = ref(25);
const itemsOffset = ref(0);
const currentPage = ref(0);

const search = ref("");
const name = ref("");
const filterTypePokemon = ref("");
const tableHeaders = ref([
  {
    title: "ID",
    align: "start",
    key: "id",
    sortable: false,
  },
  {
    title: "Avatar",
    key: "avatar",
    sortable: false,
  },
  {
    title: "Name",
    key: "name",
    sortable: false,
  },
  {
    title: "Types",
    key: "types",
    sortable: false,
    align: " d-none d-sm-table-cell",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "end",
  },
]);
const dialogFavourite = ref(false);
const expansionPanels = ref([0]);

// @TODO: Use graphql loader for vite so that we put all queries in separate file
const GET_POKEMON = gql`
  query getPokemon(
    $name: String
    $offset: Int
    $limit: Int
    $filterTypePokemon: String
  ) {
    types: pokemon_v2_pokemontype {
      id
      pokemon_v2_type {
        name
      }
    }

    info: pokemon_v2_pokemon_aggregate {
      totalPokemon: aggregate {
        count
      }
    }

    pokemon: pokemon_v2_pokemon_aggregate(
      order_by: { id: asc }
      where: {
        name: { _ilike: $name }
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _ilike: $filterTypePokemon } }
        }
      }
      offset: $offset
      limit: $limit
    ) {
      items: nodes {
        id
        name
        height
        weight
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

const { result, loading } = useQuery(GET_POKEMON, () => ({
  offset: itemsOffset.value,
  limit: itemsPerPage.value,
  name: `%${name.value}%`,
  filterTypePokemon: `%${filterTypePokemon.value}%`,
  notifyOnNetworkStatusChange: true,
}));

const pokemonItems = computed(() => result.value?.pokemon?.items ?? []);
const totalPokemon = computed(() => {
  return Number(result.value?.info?.totalPokemon?.count);
});
const pokemonTypes = computed(() => {
  const types = result.value?.types?.map(
    (type: PokemonType) => type.pokemon_v2_type.name,
  );
  return [...new Set(types)];
});

const loadItems = (options: any) => {
  currentPage.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
};

const handleFilterPokemonType = (type: string) => {
  filterTypePokemon.value = type as string;
};

const handleAddFavourite = (pokemonId: number, name: string) => {
  if (!pokemonId) return;

  dialogFavourite.value = true;
  store.addFavourite(pokemonId, name);
};

const handleRowClick = (event: Event, row) => {
  const pokemonId = row.item.id;

  router.push({ name: "/pokemon/[id]", params: { id: pokemonId } });
};

watch(currentPage, (currentPage) => {
  itemsOffset.value = itemsPerPage.value * (currentPage - 1);
});
</script>

<template>
  <v-container>
    <v-row>
      <!-- Search for Pokemon -->
      <v-col cols="12" lg="4" xl="3">
        <!-- Filter by Pokemon Types -->
        <v-expansion-panels multiple v-model="expansionPanels" flat>
          <v-expansion-panel title="Search" bg-color="blue" rounded="lg">
            <template v-slot:text>
              <v-text-field
                v-model="name"
                label="Example: Ivysaur"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </template>
          </v-expansion-panel>

          <v-expansion-panel
            title="Filter by Type"
            rounded="lg"
            bg-color="yellow-lighten-2"
          >
            <template v-slot:text>
              <div class="d-flex flex-column ga-4">
                <div class="d-flex flex-wrap ga-2 justify-center">
                  <PokemonType
                    v-for="(type, index) in pokemonTypes"
                    :key="index"
                    @click="handleFilterPokemonType(type as string)"
                    :class="[{ 'bg-blue': type === filterTypePokemon }]"
                  >
                    {{ type }}
                  </PokemonType>
                </div>
                <v-btn
                  @click="filterTypePokemon = ''"
                  block
                  variant="outlined"
                  bag="blue"
                >
                  Clear Filter
                </v-btn>
              </div>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="12" lg="8" xl="9">
        <!-- @FIXME: Find out how to remove console warning message -->
        <v-data-table-server
          class="mb-4"
          :items-per-page="itemsPerPage"
          :items-per-page-options="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
          ]"
          :headers="tableHeaders"
          :items="pokemonItems ?? []"
          :items-length="totalPokemon ?? 0"
          :loading="loading"
          item-value="name"
          :search="search"
          @update:options="loadItems"
          @click:row="handleRowClick"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>
          <template v-slot:item.name="{ value }">
            <span class="text-capitalize">{{ value }}</span>
          </template>
          <template v-slot:item.avatar="{ value }">
            <v-avatar
              :image="value[0].sprites.other.home.front_shiny"
            ></v-avatar>
          </template>
          <template v-slot:item.types="{ value }">
            <td class="d-flex flex-wrap ga-2">
              <PokemonType
                v-for="item in value"
                :key="item.id"
                size="small"
                :ripple="false"
                :disabled="false"
                >{{ item.type.name }}
              </PokemonType>
            </td>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-card-actions>
              <v-spacer></v-spacer>
              <RouterLink
                :to="{ name: '/pokemon/[id]', params: { id: item.id } }"
              >
                <v-btn density="compact" slim icon="mdi-eye-outline"></v-btn>
              </RouterLink>
              <v-btn
                density="compact"
                slim
                color="red-darken-1"
                @click.stop="handleAddFavourite(item.id, item.name)"
                icon="mdi-heart-box"
              >
              </v-btn>
            </v-card-actions>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>
</template>
