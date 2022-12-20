<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ColorsEnums } from 'src/enums'
const $router = useRouter();
</script>

<template>
  <q-page>
    <div class="text-center q-pa-md flex flex-center">
      <div>
        <div class="size-text-error" :style="{color: ColorsEnums.ColorsEnums.NavBarInitialColor}">403</div>
        <div class="text-h2 opacity-error">Pagina no encontrada</div>
        <q-btn class="q-mt-xl" color="indigo-9" unelevated label="Regresar a Inicio" no-caps
          @click="$router.push({ name: 'dashboard' })" />
      </div>
    </div>
  </q-page>
</template>

<style>
.size-text-error {
  font-size: 25vh;
}

.opacity-error {
  opacity: 0.8;
}
</style>

