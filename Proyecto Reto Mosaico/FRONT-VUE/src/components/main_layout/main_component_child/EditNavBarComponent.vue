<script setup lang="ts">
import { reactive } from 'vue';
import { ConfigurationStore } from 'src/stores';
import { storeToRefs } from 'pinia';
import UploadImageComponent from 'src/components/utils/UploadImageComponent.vue'
import { ColorsEnums } from 'src/enums'
import EditColorsNavBarComponent from './edt_nav_bar_children/EditColorsNavBarComponent.vue'

const $emit = defineEmits([
  'dynamicChange',
  'cancelUpdate',
  'restoreConfigurations',
  'saveConfiguration',
  'activeBackDrop'
]);

interface IComponentData {
  image: any;
  heightUploadImage: string;
  restoreNavConfig: boolean;
  isActiveEditNavBarButton: boolean;
  isActiveColorEditButton: boolean;
  isActiveEditTitleButton: boolean;
  isActiveEditLogoButton: boolean;
}

const componentData: IComponentData = reactive({
  image: null,
  heightUploadImage: '68',
  restoreNavConfig: false,
  isActiveEditNavBarButton: false,
  isActiveColorEditButton: false,
  isActiveEditTitleButton: false,
  isActiveEditLogoButton: false,

})
const configurationStore = ConfigurationStore.ConfigurationStore();
const { configurationChanges } = storeToRefs(configurationStore);

function dynamicChange(itemValue: string | null, itemName: string): void {
  $emit('dynamicChange', itemValue, itemName);
}

function cancelUpdate(nameObject: string): void {
  $emit('cancelUpdate', nameObject);
}

function restoreConfigurations(): void {
  $emit('restoreConfigurations');
}

async function saveConfiguration(): Promise<void> {
  await $emit('saveConfiguration');
}

function uploadImage(img: string): void {
  configurationChanges.value.imageNavBar = img;
}

function changeActiveState() {
  componentData.isActiveColorEditButton = !componentData.isActiveColorEditButton
  showBackDrop()
}

function showBackDrop(): void {
  $emit('activeBackDrop');
}
</script>

<template>
  <div>
    <q-fab vertical-actions-align="right" :style="{
      'background-color':
        configurationChanges.colorNav != null
          ? configurationChanges.colorNav
          : ColorsEnums.ColorsEnums.NavBarInitialColor,
      color:
        configurationChanges.colorItems != null
          ? configurationChanges.colorItems
          : 'white',
    }" icon="edit" direction="down" v-model="componentData.isActiveEditNavBarButton" padding="sm" external-label
      class="glossy" @click="showBackDrop()">
      <div>
        <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
          Editar titulo
        </q-tooltip>
        <q-fab label-position="right" padding="xs" direction="left" :style="{
          'background-color':
            configurationChanges.colorNav != null
              ? configurationChanges.colorNav
              : ColorsEnums.ColorsEnums.NavBarInitialColor,
          color:
            configurationChanges.colorItems != null
              ? configurationChanges.colorItems
              : 'white',
        }" icon="edit_note" label="Editar titulo" v-model="componentData.isActiveEditTitleButton" flat class="glossy"
          @click="showBackDrop()">
          <q-dialog v-model="componentData.isActiveEditTitleButton" persistent>
            <q-card class="card-edit-title">
              <q-card-section>
                <div class="text-h6">Titulo nuevo</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input dense v-model="configurationChanges.tittleNavBar" autofocus counter />
              </q-card-section>
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancelar" v-close-popup @click="cancelUpdate('tittleNavBar')" />
                <q-btn flat label="Guardar" v-close-popup @click="saveConfiguration()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-fab>
      </div>
      <div>
        <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
          Editar logo
        </q-tooltip>
        <q-fab label-position="right" padding="xs" direction="left" :style="{
          'background-color':
            configurationChanges.colorNav != null
              ? configurationChanges.colorNav
              : ColorsEnums.ColorsEnums.NavBarInitialColor,
          color:
            configurationChanges.colorItems != null
              ? configurationChanges.colorItems
              : 'white',
        }" icon="image" label="Editar logo" v-model="componentData.isActiveEditLogoButton" flat class="q-mt-xs glossy"
          @click="showBackDrop()">
          <q-dialog v-model="componentData.isActiveEditLogoButton" persistent>
            <upload-image-component @cancelUpdate="cancelUpdate" @saveConfiguration="saveConfiguration"
              @uploadImage="uploadImage" />
          </q-dialog>
        </q-fab>
      </div>
      <div>
        <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
          Barra de navegacion
        </q-tooltip>
        <q-fab padding="xs" v-model="componentData.isActiveColorEditButton" label="Barra de navegación"
          title="Barra de navegación" label-position="right" :style="{
            'background-color':
              configurationChanges.colorNav != null
                ? configurationChanges.colorNav
                : ColorsEnums.ColorsEnums.NavBarInitialColor,
            color:
              configurationChanges.colorItems != null
                ? configurationChanges.colorItems
                : 'white',
          }" icon="settings" direction="left" flat class="q-mt-xs glossy">
          <edit-colors-nav-bar-component :isActiveColorEditButton="componentData.isActiveColorEditButton"
            @changeActiveState="changeActiveState" @dynamicChange="dynamicChange" @cancelUpdate="cancelUpdate"
            @restoreConfigurations="restoreConfigurations" @saveConfiguration="saveConfiguration" />
        </q-fab>
      </div>
      <div>
        <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
          Restablecer los estilos de la barra de navegación<br />a sus valores
          predeterminados
        </q-tooltip>
        <q-fab padding="xs" v-model="componentData.restoreNavConfig" label="Restablecer valores predeterminados"
          title="Restablecer valores predeterminados" label-position="right" :style="{
            'background-color':
              configurationChanges.colorNav != null
                ? configurationChanges.colorNav
                : ColorsEnums.ColorsEnums.NavBarInitialColor,
            color:
              configurationChanges.colorItems != null
                ? configurationChanges.colorItems
                : 'white',
          }" icon="settings_backup_restore" direction="left" flat class="q-mt-xs glossy" @click="showBackDrop()">
          <q-dialog v-model="componentData.restoreNavConfig" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="warning" color="primary" text-color="white" />
                <span class="q-ml-sm">Esta acción restablecerá toda la configuración de la barra de
                  navegación</span>
              </q-card-section>
              <q-card-actions align="right" class="text-primary q-mr-md">
                <q-btn flat label="Cancelar" v-close-popup />
                <q-btn flat label="Restablecer" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-fab>
      </div>
    </q-fab>
    <q-tooltip class="text-body2 shadow-4" anchor="center left" self="center right" transition-show="scale"
      transition-hide="scale" :style="{
        'background-color':
          configurationChanges.colorNav != null
            ? configurationChanges.colorNav
            : ColorsEnums.ColorsEnums.NavBarInitialColor,
        color:
          configurationChanges.colorItems != null
            ? configurationChanges.colorItems
            : 'white',
      }" :offset="[10, 10]">
      Editar barra de navegacion
    </q-tooltip>
  </div>
</template>

<style>
.card-edit-title {
  min-width: 350px;
  border-radius: 15px;
}
</style>