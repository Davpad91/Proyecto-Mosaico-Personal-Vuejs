<script setup lang="ts">
import { reactive } from 'vue';

interface IComponentData {
  isPass1: boolean,
  isPass2: boolean,
  isPass3: boolean,
  name: string,
}

const componentData: IComponentData = reactive({
  isPass1: true,
  isPass2: true,
  isPass3: true,
  name: 'Marlon Andres Gomez Bedoya'
});

</script>

<template>
  <div class="q-pa-xl">
    <div>
      <h5 class="q-ma-xs text-bold">Perfil de usuario</h5>
      <p class="q-ml-xs text-italic">Actualiza tu contraseña en esta página</p>
      <hr />
    </div>
    <h4 class="q-ma-xs text-center text-primary text-bold">
      Cambiar contraseña
      <q-icon name="lock" />
    </h4>
    <div class="container-form">
      <form class="q-gutter-md">
        <q-input bg-color="grey-4" filled :type="componentData.isPass1 ? 'password' : 'text'" v-model="componentData.name"
          label="Contraseña actual" lazy-rules :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Por favor llena todos los campos',
          ]">
          <template v-slot:append>
            <q-icon :name="componentData.isPass1 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="componentData.isPass1 = !componentData.isPass1" />
          </template>
        </q-input>
        <q-input bg-color="grey-4" filled :type="componentData.isPass2 ? 'password' : 'text'" v-model="componentData.name"
          label="Nueva contraseña" lazy-rules :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Por favor llena todos los campos',
          ]">
          <template v-slot:append>
            <q-icon :name="componentData.isPass2 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="componentData.isPass2 = !componentData.isPass2" />
          </template>
        </q-input>
        <q-input bg-color="grey-4" filled :type="componentData.isPass3 ? 'password' : 'text'" v-model="componentData.name"
          label="Confirmación de contraseña" lazy-rules :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Por favor llena todos los campos',
          ]">
          <template v-slot:append>
            <q-icon :name="componentData.isPass3 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="componentData.isPass3 = !componentData.isPass3" />
          </template>
        </q-input>
        <div>
          <q-tooltip class="text-body2 shadow-4" anchor="top right" self="bottom right" transition-show="scale"
            transition-hide="scale">
            Con el boton "Actualizar contraseña"<br />
            podrás guardar tu nueva contraseña.<br /><br />
            Con el botón "Limpiar"<br />
            podras limpiar todos los campos.
          </q-tooltip>
          <q-btn round icon="help" class="float-right" color="primary" />
        </div>
        <div>
          <q-btn label="Actualizar contraseña" color="primary" />
          <q-btn label="Limpiar" type="reset" icon="lock_reset" color="primary" flat class="q-ml-sm" />
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.container-form {
  padding: 5px 230px 0px 230px;
}
</style>