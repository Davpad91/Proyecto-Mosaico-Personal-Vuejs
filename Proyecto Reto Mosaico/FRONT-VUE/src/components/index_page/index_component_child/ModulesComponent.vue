<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import draggable from 'vuedraggable';
import { ConfigurationStore } from 'src/stores';
import { storeToRefs } from 'pinia';
import UploadImageComponent from 'src/components/utils/UploadImageComponent.vue'
import { storage, notifications, validations } from 'src/common';

interface IComponentData {
  dragging: boolean
  image: any
  title: string
  see: boolean
}

const componentData: IComponentData = reactive({
  dragging: false,
  image: null,
  title: '',
  see: false,
});

const props = defineProps(['editModules'])
const router = useRouter();
const $emit = defineEmits(['saveModules']);
const configurationStore = ConfigurationStore.ConfigurationStore();
const { configurationChanges } = storeToRefs(configurationStore);

function goTo(path: string, state: boolean): void {
  if (state == props.editModules) router.push({ name: path });
}

function settitle(id: string): void {
  configurationChanges.value.modules.forEach((element: any) => {
	if (element.id == id) componentData.title = element.title;
  });
}

async function savetitle(id: string): Promise<void> {
  if (componentData.title) {
	configurationChanges.value.modules.forEach((element: any) => {
	  if (element.id == id) element.title = componentData.title;
	});
	await configurationStore.saveConfiguration();
  }
}

function saveState(id: string, tag_id: string): void {
  configurationChanges.value.modules.forEach((element: any) => {
	if (element.id == id) {
	  element.isActive = !element.isActive;
	  const card: HTMLElement | null = document.getElementById(tag_id);
	  (card == null) ? notifications.showErrorNotification('Error al guardar el estado de los modulos')
		: (element.isActive) ? card.classList.remove('index-card-disabled') : card.classList.add('index-card-disabled');
	}
  });
}

async function saveImage(id: string): Promise<void> {
  if (componentData.image) {
	configurationChanges.value.modules.forEach((element: any) => {
	  if (element.id == id) element.icon = componentData.image;
	});
	await configurationStore.saveConfiguration();
  }
}

function saveModules() {
  $emit('saveModules');

}

function saveConfiguration(id: string): void {
  saveModules()
  saveImage(id);
}

function uploadImage(image: string): void {
  componentData.image = image;
}

onBeforeUnmount(async () => {
  if (storage.getAuthenticatedUser() && configurationStore.checkModuleChanges())
	await configurationStore.saveConfiguration();
});

onBeforeMount(() => {
  if (validations.isAdminOrSuperAdmin() && useRoute().name == 'dashboard') {
	componentData.see = true;
	window.onbeforeunload = (e: BeforeUnloadEvent) => {
	  if (ConfigurationStore.ConfigurationStore().checkModuleChanges()) {
		e.preventDefault();
		e.returnValue = '';
	  }
	};
  } else {
	componentData.see = false;
  }
});
</script>

<template>
  <draggable v-model="configurationChanges.modules" item-key="id" :disabled="props.editModules" class="cards-container"
	ghost-class="ghost" @start="componentData.dragging = true" @end="componentData.dragging = false">
	<template #item="{ element }">
	  <q-card :class="
		!props.editModules ? 'index-card cursor_pointer' : 'index-card'
	  " :id="`module_${element.id}`">
		<div class="row items-center row justify-between" v-if="componentData.see">
		  <div class="q-pl-xs">
			<q-tooltip class="text-body2 shadow-4" anchor="center right" self="center left" :offset="[10, 10]">
			  Editar modulo
			</q-tooltip>
			<q-btn icon="more_vert" size="sm" round flat>
			  <q-menu class="shadow-8">
				<q-list dense class="menu-list">
				  <q-item clickable v-ripple>
					<q-item-section @click="settitle(element.id)">
					  <p class="q-ma-none">
						Editar titulo
						<q-icon name="edit" />
					  </p>
					  <q-popup-edit v-model="element.title" class="shadow-8">
						<q-input v-model="componentData.title" dense autofocus counter />
						<q-btn flat label="Cancelar" v-close-popup color="primary" />
						<q-btn flat label="Guardar" color="primary" v-close-popup @click="savetitle(element.id)" />
					  </q-popup-edit>
					</q-item-section>
				  </q-item>
				  <q-separator />
				  <q-item clickable v-ripple>
					<q-item-section>
					  <p class="q-ma-none">
						Editar icono
						<q-icon name="image" />
					  </p>
					  <q-popup-edit v-model="undefined" id="file-edit-popup" >
						<upload-image-component @saveConfiguration="saveConfiguration(element.id)"
						@uploadImage="uploadImage" />
					  </q-popup-edit>
					</q-item-section>
				  </q-item>
				</q-list>
			  </q-menu>
			</q-btn>
		  </div>
		  <div>
			<p class="q-pt-xs q-pr-sm q-ml-xl q-mb-xs text-green" v-if="element.isActive"
			  @click="saveState(element.id, `module_${element.id}`)">
			  Activo
			  <q-btn size="sm" round icon="fa-solid fa-circle-check" flat v-model="undefined" val="md" />
			  <q-tooltip class="bg-red-4 text-body2 shadow-4" :offset="[10, 10]">
				Desactivar modulo
			  </q-tooltip>
			</p>
			<p class="q-pt-xs q-pr-sm q-mb-xs text-red state-text" v-else
			  @click="saveState(element.id, `module_${element.id}`)">
			  Inactivo
			  <q-btn size="sm" round icon="fa-solid fa-circle-xmark" flat v-model="undefined" val="md" />
			  <q-tooltip class="bg-light-green-5 text-body2 shadow-4" :offset="[10, 10]">
				Activar modulo
			  </q-tooltip>
			</p>
		  </div>
		</div>
		<div :style="{
		  height: componentData.see ? '' : '100%',
		}" :class="
		  !props.editModules ? 'cursor_pointer' : 'cursor_notallowed'
		" :disabled="element.isActive ? undefined : !element.isActive"
		  v-on:click="goTo(element.url, element.isActive)">
		  <q-skeleton class="column justify-center bg-transparent cursor-pointer"
			:style="componentData.see ? '' : 'height: 100%'" animation="pulse"
			v-if="!props.editModules && componentData.see">
			<q-card-section class="card-modules">
			  <div class="card-header text-center">{{ element.title }}</div>
			</q-card-section>
			<q-card-section class="text-center">
			  <img :src="element.icon" :alt="element.title" :width="80" />
			</q-card-section>
		  </q-skeleton>
		  <div v-else class="column justify-center" :style="componentData.see ? '' : 'height: 100%'">
			<q-card-section class="card-modules">
			  <div class="card-header text-center">{{ element.title }}</div>
			</q-card-section>
			<q-card-section class="text-center">
			  <img :src="element.icon" :alt="element.title" :width="80" />
			</q-card-section>
		  </div>
		</div>
	  </q-card>
	</template>
  </draggable>
</template>

<style>
.menu-list {
  min-width: 110px;
}

#file-edit-popup {
  border-radius: 15px;
  padding: 0px;  
  
}

.card-modules {
  padding: 5px;
}
</style>