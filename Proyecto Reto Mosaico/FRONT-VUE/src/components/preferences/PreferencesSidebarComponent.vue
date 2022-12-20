<script setup lang="ts">
import { storage } from 'src/common';
import { useRouter } from 'vue-router';
import { app } from 'src/interfaces';
import { reactive } from 'vue';

interface IcomponentData {
  image: string | null
}

const componentData : IcomponentData = reactive({
  image: null
});

const router = useRouter();

const user: app.UserInfo | null = storage.getAuthenticatedUser();

function goTo(path: string): void {
  router.push({ name: path });
}

function uploadImageProfile(image: string): void {
  componentData.image = image
}
</script>

<template>
  <q-layout view="hHh LpR fff" class="row preferencees-size">
    <q-scroll-area class="scroll-size">
      <div class="bg-grey-4 menu-size">
        <q-list bordered padding>
          <q-item>
            <q-item-section>
              <div class="q-mb-md q-ml-xs">
                <q-avatar size="72px">
                  <img v-if="componentData.image" :src="componentData.image" />
                  <img v-else src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </div>
              <div>
                {{ user ? user.name : '' }}
              </div>
              <q-item-label caption>Preferencias de usuario</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('user-profile')" exact>
            <q-item-section>
              <q-item-label>Perfil de usuario</q-item-label>
              <q-item-label caption> Gestiona tu perfil personal </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('user-answers')" exact>
            <q-item-section>
              <q-item-label>Preguntas</q-item-label>
              <q-item-label caption>
                Cambia tus preguntas de seguridad</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('user-password')" exact>
            <q-item-section>
              <q-item-label>Contraseña</q-item-label>
              <q-item-label caption>Cambia tu contraseña</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>
    <q-page-container class="page-container-size">
      <q-page class="preferencees-size">
        <q-scroll-area id="table-scroll-area" class="table-scroll-size">
          <div class="table-container table-container-size">
            <router-view @uploadImageProfile="uploadImageProfile" />
          </div>
        </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
.preferencees-size {
  min-height: calc(100vh - 122px) !important;
  max-height: calc(100vh - 122px) !important;
  max-width: 100% !important;
}

.scroll-size {
  width: 270px;
  height: calc(100vh - 122px);
}

.menu-size {
  max-width: 100%;
  height: 800px;
}

.page-container-size {
  width: calc(100% - 270px);
  max-width: calc(100% - 270px);
  height: fit-content;
}

.table-scroll-size {
  width: 100%;
  max-width: 100%;
  height: calc(100vh - 122px);
}

.table-container-size {
  height: 100%;
  max-width: 100%;
}

#table-scroll-area .q-scrollarea__container .q-scrollarea__content.absolute {
  position: relative !important;
}
</style>
