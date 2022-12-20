<script setup lang="ts">
import { Router, RouteRecordName, useRouter } from 'vue-router';
import { ConfigurationStore, LoadingStore } from 'src/stores';
import { storage } from 'src/common';
import { storeToRefs } from 'pinia';
import { hierarchyRolesEnums, ColorsEnums } from 'src/enums'
import { app } from 'src/interfaces';

const $router: Router = useRouter();

const props = defineProps<{
  currentRoute: RouteRecordName | null | undefined
}>();

const user: app.UserInfo | null = storage.getAuthenticatedUser();
const loadingutilsStore = LoadingStore.LoadingStore();
const configurationStore = ConfigurationStore.ConfigurationStore();
const { configurationChanges } = storeToRefs(configurationStore);

function goTo(path: string): void {
  $router.push({ name: path });
}

function logout(): void {
  loadingutilsStore.showLoading();
  $router.push({ name: 'signin' });
  loadingutilsStore.hideLoading();
  storage.clearStorage();
}

function isAllowedToSee(): boolean {
  return (user && user.role.hierarchy == hierarchyRolesEnums.hierarchyRolesEnums.SuperAdministrator) ? true : false;
}
</script>
<template>
  <div id="navbar-user-options" class="navbar-option" :style="{
	color:
	  configurationChanges.colorItems != null
		? configurationChanges.colorItems
		: ColorsEnums.ColorsEnums.ItemsInitialColor,
  }">
	<q-btn-dropdown padding="0" unelevated icon="fa-solid fa-user">
	  <div class="row no-wrap q-pa-md">
		<div class="column items-center options-style">
		  <q-avatar size="72px">
			<img src="https://cdn.quasar.dev/img/boy-avatar.png" />
		  </q-avatar>
		  <div class="text-subtitle1 q-mt-md q-mb-xs">
			{{ user ? user.name : '' }}
		  </div>
		  <div class="text-subtitle2 q-mb-xs">
			{{ user ? user.email : '' }}
		  </div>
		  <q-separator color="grey-5s" class="q-my-sm full-width" />
		  <q-btn class="full-width" v-if=" props.currentRoute != 'dashboard'" flat color="primary" label="Inicio" push
			size="md" v-close-popup @click="goTo('dashboard')" />
		  <q-btn class="full-width" flat color="primary" label="Preferencias" push size="md" v-close-popup
			@click="goTo('user-profile')" />
		  <q-btn v-if="isAllowedToSee()" class="full-width" flat color="primary" label="Administración" push size="md"
			v-close-popup @click="goTo('admin-dashboard')" />
		  <q-btn class="full-width" flat color="primary" label="Cerrar sesión" push size="md" v-close-popup
			@click="logout()" />
		</div>
	  </div>
	</q-btn-dropdown>
  </div>
</template>
<style>
.options-style {
  min-width: 200px;
}
</style>