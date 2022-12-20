<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { NotificationStore } from 'src/stores';
import { storeToRefs } from 'pinia';
import { app } from 'src/interfaces';

interface IComponentData {
  showNotifications: boolean;
  noNotifications: boolean;
}

const componentData: IComponentData = reactive({
  showNotifications: false,
  noNotifications: false,
})

const notificationStore = NotificationStore.NotificationStore();
const { notifications } = storeToRefs(notificationStore);

function removeNotification(id: string): void {
  notifications.value.forEach((element: app.AppNotification) => {
    if (element.id == id) {
      notificationStore.removeNotification(id);
    }
  });
}

function removeNotifications(): void {
  componentData.noNotifications = true;
  notificationStore.removeNotifications();
}

onBeforeMount((): void => {
  notificationStore.loadDefaultNotifications(); //TODO: Delete this, this is just a test
  if (!notificationStore.getNotifications) componentData.noNotifications = true;
});
</script>

<template>
  <q-btn-dropdown v-model="componentData.showNotifications" padding="0" unelevated dropdown-icon="fa-solid fa-bell"
    no-icon-animation>
    <div class="row no-wrap q-pa-md">
      <div class="column notifications-container">
        <div class="q-mb-md row justify-between items-center">
          <div class="text-subtitle2">Notificaciones</div>
          <div>
            <q-btn flat round color="negative" icon="clear_all" size="sm" @click="removeNotifications" />
            <q-btn flat round color="grey" icon="close" size="sm"
              @click="componentData.showNotifications = !componentData.showNotifications" />
          </div>
        </div>
        <div id="notifications" v-if="!componentData.noNotifications">
          <q-list>
            <q-scroll-area class="notifications-content">
              <div v-for="notification in notifications" :key="notification.id">
                <q-separator class="full-width" />
                <q-item dense class="q-pa-sm notification-item">
                  <q-item-section>
                    <q-item-label>Nueva actualización</q-item-label>
                    <q-item-label class="notification-message" caption lines="2">{{
                    notification.message }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{
                    notification.caption
                    }}</q-item-label>
                    <q-btn flat round color="negative" icon="delete_sweep" size="sm" class="remove-notification-button"
                      @click="removeNotification(notification.id)" />
                  </q-item-section>
                </q-item>
              </div>
            </q-scroll-area>
          </q-list>
        </div>
        <div v-else>
          <q-separator spaced class="full-width" />
          <p>No tienes notificaciones nuevas</p>
        </div>
      </div>
    </div>
  </q-btn-dropdown>
</template>

<style>
.notification-item {
  background-color: white;
  cursor: pointer;
  height: 66px !important;
}

.notification-item .remove-notification-button{
  visibility: hidden !important;
}

.notification-item:hover {
  background-color: rgb(201, 207, 235);
}

.notification-item:hover .remove-notification-button{
  visibility: visible !important;
}

.notifications-container {
  height: fit-content !important;
  width: 300px !important;
}

.notifications-content {
  height: 265px !important;
  max-width: 300px !important;
}

.notification-message {
  max-width: 187px !important;
  text-overflow: ellipsis !important;
}

.remove-notification-button {
  top: 5px !important;
  right: 30px !important;
  visibility: hidden !important;
}
</style>
