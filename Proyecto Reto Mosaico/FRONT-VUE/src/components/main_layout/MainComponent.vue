<script setup lang="ts">
import { reactive } from 'vue';
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router';
import { ConfigurationStore } from 'src/stores';
import { storage } from 'src/common';
import { storeToRefs } from 'pinia';
import { hierarchyRolesEnums, ColorsEnums } from 'src/enums/'
import EditNavBarComponent from './main_component_children/EditNavBarComponent.vue';
import ChatBotComponent from './main_component_children/ChatBotComponent.vue';
import NotificationsComponent from './main_component_children/NotificationsComponent.vue';
import UserOptionsComponent from './main_component_children/UserOptionsComponent.vue';
import { app } from 'src/interfaces';

interface IComponentData {
  currentRoute: RouteLocationNormalizedLoaded;
  show: boolean;
  showChatBot: boolean;
  ShowBackdrop: boolean;
}

const componentData: IComponentData = reactive({
  currentRoute: useRoute(),
  show: false,
  showChatBot: false,
  ShowBackdrop: false
})

const $router: Router = useRouter();

const user: app.UserInfo | null = storage.getAuthenticatedUser();
const configurationStore = ConfigurationStore.ConfigurationStore();
const { configurationChanges } = storeToRefs(configurationStore);

function dynamicChange(itemValue: string, itemName: string): void {
  configurationStore.setConfigurationItem(itemValue, itemName);
}

function cancelUpdate(nameObject: string): void {
  configurationStore.restoreConfigurationItem(nameObject);
}

function restoreConfigurations(): void {
  configurationStore.restoreConfiguration();
}

async function saveConfiguration(): Promise<void> {
  await configurationStore.saveConfiguration();
}

function isAllowedToSeeInDashboard(): boolean {
  return (user && user.role.hierarchy == hierarchyRolesEnums.hierarchyRolesEnums.SuperAdministrator && componentData.currentRoute.name == 'dashboard') ? true : false;
}

function activeBackDrop(): void {
  componentData.ShowBackdrop = !componentData.ShowBackdrop;
}
</script>

<template>
  <q-layout view="hHh LpR fff">
    <div id="backdrop" :class="{ backdrop: componentData.ShowBackdrop || componentData.showChatBot }"></div>
    <q-header elevated>
      <q-toolbar class="header row justify-between" :style="{
              'background-color':
      configurationChanges.colorNav != null
        ? configurationChanges.colorNav
        : ColorsEnums.ColorsEnums.NavBarInitialColor,
      }">
        <div class="cursor-pointer col" @click="$router.push('/')">
          <div class="logo-sura-arus col text-left">
            <img :src="configurationChanges.imageNavBar" height="50" alt="ARUS, una empresa del grupo SURA" />
          </div>
        </div>
        <div class="mosaico-title col text-center" :style="{
          color:
            configurationChanges.colorItems != null
              ? configurationChanges.colorItems
              : ColorsEnums.ColorsEnums.ItemsInitialColor,
        }">
          <h1 class="mosaico-heading">
            {{ configurationChanges.tittleNavBar }}
          </h1>
        </div>
        <div class="navbar-options col">
          <div class="navbar-option navbar-notification-option" :style="{
            color:
              configurationChanges.colorItems != null
                ? configurationChanges.colorItems
                : ColorsEnums.ColorsEnums.ItemsInitialColor,
          }">
            <notifications-component />
          </div>
          <user-options-component :currentRoute="componentData.currentRoute.name" />
          <!-- -------------------------------------- -->
          <div v-if="isAllowedToSeeInDashboard()" class="absolute-top-right edit-nav-bar">
            <edit-nav-bar-component @activeBackDrop="activeBackDrop" @dynamicChange="dynamicChange"
              @cancelUpdate="cancelUpdate" @restoreConfigurations="restoreConfigurations"
              @saveConfiguration="saveConfiguration" />
          </div>
          <div class="absolute">
            <div class="bg-blue-grey-5 absolute-top-right chat-bot-button"
              @click="componentData.showChatBot = !componentData.showChatBot">
              <q-icon class="q-ml-xs q-mb-md q-mt-sm" name="headset_mic" />
              <div class="rotate-270 text-subtitle2">Chat</div>
            </div>
            <div class="q-pa-md row justify-center" v-if="componentData.showChatBot">
              <div class="fixed bg-white chat-bot-style">
                <chat-bot-component />
              </div>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="page-container-style">
      <router-view />
    </q-page-container>
    <q-footer class="footer" elevated bordered>
      <img src="/img/logo-arus.png" alt="ARUS, Tecnología + Información + Conocimiento" />
      <span class="material-icons text-caption q-pb-xs q-mr-xs">
        copyright
      </span> 2022 | ARUS, Tecnología + Información + Conocimiento
    </q-footer>
  </q-layout>
</template>

<style>
#backdrop {
  position: absolute;
}

.backdrop {
  z-index: 2;
  width: 100%;
  height: 100%;
  backdrop-filter: brightness(40%);
}

.fa-solid.fa-bell {
  font-size: 16px;
}

.fa-solid.fa-user {
  font-size: 16px;
  margin-right: -10px;
}

.chat-bot-style {
  top: 25rem;
  right: 5%;
  z-index: 3;
  width: 100%;
  max-width: 400px;
}

.chat-bot-button {
  top: 30rem;
  border-radius: 15px 0px 0px 15px;
  font-size: 22px;
  position: fixed;
  z-index: 2;
  height: 6rem;
  width: 1.7rem;
  right: 0.1px;
}

.edit-nav-bar {
  top: 115%;
  right: 1%;
  z-index: 3;
}

.page-container-style {
  max-width: 100vw
}
</style>
