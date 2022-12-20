<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, reactive } from 'vue';
import ModulesComponent from './index_component_children/ModulesComponent.vue';
import InformationComponent from './index_component_children/InformationComponent.vue';
import { useRoute } from 'vue-router';
import { LoadingStore, ConfigurationStore } from 'src/stores';
import { storeToRefs } from 'pinia';
import { storage, notifications, validations } from 'src/common';
import { app } from 'src/interfaces';

interface IComponentData {
  showEditModulesButton: boolean
  editModules: boolean
}

const componentData: IComponentData = reactive({
  showEditModulesButton: false,
  editModules: true,
});

const loading = LoadingStore.LoadingStore();
const configurationStore = ConfigurationStore.ConfigurationStore();
const { configurationChanges } = storeToRefs(configurationStore);
const barColor = '#1a2e76';

async function saveModules(): Promise<void> {
  loading.showLoading();

  if (componentData.editModules) {
    componentData.editModules = false;
    loading.hideLoading();
  } else {
    try {
      await configurationStore.saveConfiguration()

      componentData.editModules = true;
      notifications.showSuccessNotification(
        'Configuración guardada correctamente'
      );
    } catch (error: any) {
      notifications.showErrorNotification(error.response.data.message);
    };
  }
  
  loading.hideLoading();
}

onMounted(() => {
  configurationChanges.value.modules.forEach((element: app.Module) => {
    const card: HTMLElement | null = document.getElementById(`module_${element.id}`);
    (card == null) ? notifications.showErrorNotification('Error al traer los modulos')
      : (element.isActive) ? card.classList.remove('index-card-disabled') : card.classList.add('index-card-disabled');
  });
});

onBeforeUnmount(async () => {
  if (storage.getAuthenticatedUser() && configurationStore.checkModuleChanges())
    await configurationStore.saveConfiguration();
  componentData.editModules = true;
});

onBeforeMount(() => {
  if (validations.isAdminOrSuperAdmin() && useRoute().name == 'dashboard') {
    componentData.showEditModulesButton = true;
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      if (ConfigurationStore.ConfigurationStore().checkModuleChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
  } else {
    componentData.showEditModulesButton = false;
  }
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <modules-component @saveModules="saveModules" :editModules="componentData.editModules" />
    <div class="fixed position-modules-button" v-if="componentData.showEditModulesButton">
      <q-tooltip v-if="componentData.editModules" class="text-body2 shadow-4" anchor="center left" self="center right"
        transition-show="scale" transition-hide="scale" :style="{
          'background-color':
            configurationChanges.colorNav != null
              ? configurationChanges.colorNav
              : barColor,
          color:
            configurationChanges.colorItems != null
              ? configurationChanges.colorItems
              : 'white',
        }" :offset="[10, 10]">
        Configurar los módulos
      </q-tooltip>
      <q-tooltip v-else class="text-body2 shadow-4" anchor="center left" self="center right" transition-show="scale"
        transition-hide="scale" :style="{
          'background-color':
            configurationChanges.colorNav != null
              ? configurationChanges.colorNav
              : barColor,
          color:
            configurationChanges.colorItems != null
              ? configurationChanges.colorItems
              : 'white',
        }" :offset="[10, 10]">
        Guardar Cambios
      </q-tooltip>
      <q-btn v-model="componentData.editModules" :icon="componentData.editModules ? 'folder' : 'save'" round size="md"
        :style="{
          'background-color':
            configurationChanges.colorNav != null
              ? configurationChanges.colorNav
              : barColor,
          color:
            configurationChanges.colorItems != null
              ? configurationChanges.colorItems
              : 'white',
        }" @click="saveModules()" class="glossy" />
    </div>
    <div class="fixed position-information-button">
      <information-component />
    </div>
  </q-page>
</template>

<style>
.cards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.index-card {
  min-width: 270px;
  height: 220px;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 5px 10px -2px gray;
}

.index-card:hover,
.index-card:focus {
  background-color: rgb(201, 207, 235);
  transition: all 0.2s ease-out;
}

.index-card-disabled {
  background-color: white !important;
  cursor: not-allowed !important;
}

.index-card-disabled .state-text {
  cursor: pointer !important;
}

.card-header {
  font-size: 16px;
}

.hoverEffect:hover {
  background-color: white;
}

.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.cursor_pointer,
.cursor_pointer[disabled],
.cursor_pointer[disabled] * {
  cursor: pointer !important;
}

.q-skeleton:before {
  content: none;
}

.position-modules-button {
  top: 8.36rem;
  right: 0.9rem;
}

.position-information-button {
  top: 11.6rem;
  right: 0.9rem;
}
</style>