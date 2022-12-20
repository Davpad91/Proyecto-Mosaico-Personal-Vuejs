<script setup lang="ts">
import { reactive } from 'vue';
import { node, app } from 'src/interfaces';
import { storage, notifications } from 'src/common';
import UploadImageComponent from 'src/components/utils/UploadImageComponent.vue'
import { AxiosResponse } from 'axios';
import { AccountService } from 'src/services';

const authenticatedUser: app.UserInfo | null = storage.getAuthenticatedUser();

interface IComponentData {
  editButton: boolean;
  photoProfile: string | null;
  user: app.UserInfo;
  phone: number;
}

const componentData: IComponentData = reactive({
  editButton: false,
  photoProfile: null,
  user: authenticatedUser ? authenticatedUser : {} as app.UserInfo,
  phone: authenticatedUser != null ? authenticatedUser.phone : 0,
});

const emit = defineEmits([
  'uploadImageProfile'
]);

function uploadImageProfile(): void {
  emit('uploadImageProfile', componentData.photoProfile)
}

async function updatedPhone(): Promise<void> {
  try {
    if (String(componentData.phone).length === 10) {
      const userUpdate: node.UserUpdate = {
        id: componentData.user.id,
        phone: componentData.phone
      };

      const response: AxiosResponse<node.User> = await AccountService.updateUser(userUpdate);
      storage.updateUser(response.data, ['phone']);

      notifications.showSuccessNotification(
        'El numero de celular fue actualizado de manera exitosa'
      );
    } else {
      notifications.showErrorNotification(
        'Por favor digite su numero celular, debe contener 10 digitos'
      );
    }
  } catch (error: any) {
    notifications.showErrorNotification(error.response.data.message);
  }
}

function saveConfiguration(): void {
  //TODO: Create property imageProfile in collection Config
  uploadImageProfile();
}

function uploadImage(image: string): void {
  componentData.photoProfile = image;
}
</script>

<template>
  <div class="q-pa-xl">
    <div>
      <h5 class="q-ma-xs text-bold">Perfil de usuario</h5>
      <p class="q-ml-xs text-italic">Edita tu perfil personal en esta página</p>
      <hr />
    </div>
    <div class="row q-mt-xl">
      <div class="col-8">
        <q-form class="q-gutter-md">
          <div class="bg-grey-4 info-card">
            <q-item class="q-pb-md">
              <q-item-section>
                <q-item-label class="text-bold">{{ componentData.user.name }}</q-item-label>
                <q-item-label caption>Nombre completo</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-pb-md">
              <q-item-section class="text-bold">
                <q-item-label>{{ componentData.user.email }}</q-item-label>
                <q-item-label caption>Correo electrónico</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-pb-md">
              <q-item-section class="text-bold">
                <q-item-label>{{ componentData.user.idCard }}</q-item-label>
                <q-item-label caption>Numero de identificación</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div>
            <q-input clearable filled bg-color="grey-4" v-model="componentData.phone" label="Número de celular"
              class="q-pb-md" maxlength="10" mask="##########" :rules="[
                (val) =>
                  (val && val.length > 0 && val.length <= 10) ||
                  'Por favor digite su número de celular, debe contener 10 digitos',
              ]" />
            <div>
              <q-tooltip class="text-body2 shadow-4" anchor="top right" self="bottom right" transition-show="scale"
                transition-hide="scale">
                Con el botón "Actualizar número de celular"<br />
                podrás guardar tu nuevo número de contacto.
              </q-tooltip>
              <q-btn round icon="help" class="float-right" color="primary" />
            </div>
            <div>
              <q-btn label="Actualizar número de celular" color="primary" icon="phone_iphone"
                class="float-right q-mr-sm" @click.prevent="updatedPhone()" />
            </div>
          </div>
        </q-form>
      </div>
      <div class="col-4 q-pl-xl text-center">
        <q-fab class="absolute edit-button" icon="edit" color="primary" v-model="componentData.editButton" />
        <q-tooltip class="text-body2 shadow-4" anchor="center left" self="bottom left" transition-show="scale"
          transition-hide="scale">
          Editar foto de perfil
        </q-tooltip>
        <q-dialog v-model="componentData.editButton" persistent>
          <upload-image-component @saveConfiguration="saveConfiguration" @uploadImage="uploadImage" />
        </q-dialog>
        <q-avatar id="avatar" size="200px">
          <img v-if="componentData.photoProfile" :src="componentData.photoProfile" />
          <img v-else src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </div>
    </div>
  </div>
</template>

<style>
.edit-button {
  z-index: 2;
  margin-top: 155px;
}

.info-card {
  border-radius: 8px;
}

#dialog-file {
  width: 400px;
  height: 170px;
  border-radius: 15px;
}

#avatar {
  z-index: 1
}
</style>