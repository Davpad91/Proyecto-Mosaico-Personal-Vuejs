<script setup lang="ts">import { reactive } from 'vue';

const $emit = defineEmits([
  'dynamicChange',
  'cancelUpdate',
  'restoreConfigurations',
  'saveConfiguration',
  'changeActiveState',
]);

const props = defineProps<{
  isActiveColorEditButton: boolean
}>()

interface IComponentData {
  colorValueNavBar: string;
  colorValueItems: string;
  activeDialog: boolean,
}

const componentData: IComponentData = reactive({
  colorValueNavBar: '',
  colorValueItems: '',
  activeDialog: true
})

function changeActiveState(): void {
  $emit('changeActiveState');
}

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
</script>

<template>
  <div v-if="props.isActiveColorEditButton">
    <q-dialog v-model="componentData.activeDialog" persistent>
      <div class="bg-white q-pb-md rounded-border">
        <div class="q-pb-xs row">
          <div class="col q-pa-md bg-blue-grey-4 text-center inset-shadow-down">
            <div class="text-weight-medium q-pb-md">
              Color barra de navegacion
            </div>
            <q-color v-model="componentData.colorValueNavBar" class="bg-transparent no-shadow no-border rounded-borders"
              @update:model-value="
                (val) => dynamicChange(val, 'colorNav')
              " no-footer />
            <q-btn icon="rotate_left" round shadow-4 color="blue-grey-5" v-on:click="cancelUpdate('colorNav')" />
          </div>
          <div class="col q-pa-md bg-blue-grey-3 inset-shadow-down text-center">
            <div class="text-weight-medium q-pb-md">
              Color de la fuente
            </div>
            <q-color v-model="componentData.colorValueItems" class="bg-transparent no-shadow no-border rounded-borders"
              no-footer @update:model-value="
                (val) => dynamicChange(val, 'colorItems')
              " />
            <q-btn icon="rotate_left" round shadow-4 color="blue-grey-4" v-on:click="cancelUpdate('colorItems')" />
          </div>
        </div>
        <div align="right" class="text-primary q-mr-md">
          <q-btn flat label="Cancelar" v-close-popup @click="() => {
              restoreConfigurations(), 
              changeActiveState()
          }" />
          <q-btn flat label="Guardar" v-close-popup @click=" () => {
              saveConfiguration(),
              changeActiveState()
              componentData.activeDialog = !componentData.activeDialog
          }" />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<style>
.card-edit-title {
  min-width: 350px;
  border-radius: 15px;
}
</style>