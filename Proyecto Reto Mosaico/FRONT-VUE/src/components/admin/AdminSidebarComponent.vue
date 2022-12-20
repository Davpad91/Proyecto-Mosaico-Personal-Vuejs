<script setup lang="ts">
import { Ref, ref } from 'vue';
import { Router, useRouter } from 'vue-router';

const $router: Router = useRouter();

const check_notifications: Ref<boolean> = ref(true);
const check_sound: Ref<boolean> = ref(true);

function goTo(path: string): void {
  $router.push({ name: path });
}

//TODO: Manage notifications and sounds
</script>

<template>
  <q-layout view="hHh LpR fff" class="row admin-layout-size">
    <q-scroll-area class="sidebar-menu">
      <div class="sidebar-menu-container bg-grey-4">
        <q-list bordered padding class="full-height">
          <q-item-label header class="text-grey-8">Mosaico</q-item-label>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('admin-dashboard')" exact>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
              <q-item-label caption>
                Panel principal de administración
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('rating-list')" exact>
            <q-item-section>
              <q-item-label>Calificaciones</q-item-label>
              <q-item-label caption>
                Lista de calificaciones de usuario
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header class="text-grey-8">Gestión de usuarios</q-item-label>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('user-list')" exact>
            <q-item-section>
              <q-item-label>Usuarios</q-item-label>
              <q-item-label caption>
                Lista de usuarios registrados
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('user-create')" exact>
            <q-item-section>
              <q-item-label>Nuevos usuarios</q-item-label>
              <q-item-label caption>
                Crear nuevos usuarios
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header class="text-grey-8">Gestión de roles</q-item-label>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('role-list')" exact>
            <q-item-section>
              <q-item-label>Roles</q-item-label>
              <q-item-label caption> Lista de roles de usuario </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header class="text-grey-8">Gestión de dispositivos</q-item-label>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('device-list')" exact>
            <q-item-section>
              <q-item-label>Dispositivos</q-item-label>
              <q-item-label caption>
                Lista de dispositivos de usuario
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple active-class="bg-blue-grey-3" @click="goTo('device-create')" exact>
            <q-item-section>
              <q-item-label>Nuevos dispositivos</q-item-label>
              <q-item-label caption>
                Crear nuevos de dispositivos de usuarios
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header class="text-grey-8">Configuración general</q-item-label>
          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox v-model="check_notifications" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notificaciones</q-item-label>
              <q-item-label caption>
                Mostrar notificaciones de modificaciones en el sistema
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox v-model="check_sound" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sonido</q-item-label>
              <q-item-label caption>
                Reproducir sonido en cada notificación
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>
    <q-page-container class="page-container">
      <q-page class="page-content">
        <q-scroll-area id="table-scroll-area">
          <div class="table-container">
            <router-view />
          </div>
        </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
#table-scroll-area {
  width: 100% !important;
  max-width: 100% !important;
  height: calc(100vh - 122px) !important;
}

#table-scroll-area .q-scrollarea__container .q-scrollarea__content.absolute {
  position: relative !important;
}

.admin-layout-size {
  min-height: calc(100vh - 122px) !important;
  max-height: calc(100vh - 122px) !important;
}

.sidebar-menu {
  width: 270px !important;
  height: calc(100vh - 122px) !important;
}

.sidebar-menu-container {
  max-width: 100% !important;
  height: 100% !important;
}

.page-container {
  width: calc(100% - 270px) !important;
  max-width: calc(100% - 270px) !important;
  height: fit-content !important;
}

.page-content {
  min-height: calc(100vh - 122px) !important;
  max-height: calc(100vh - 122px) !important;
  max-width: 100% !important;
}

.table-container {
  height: 100% !important;
  max-width: 100% !important;
}
</style>
