import { defineStore, StateTree, StoreDefinition } from 'pinia';
import { app } from 'src/interfaces';
import { storage } from 'src/common';
import { v4 as uuidv4 } from 'uuid';

export const NotificationStore: StoreDefinition = defineStore(
  'NotificationStore',
  {
    state: () => ({
      notifications: storage.getNotifications() || [],
    }),

    getters: {
      getNotifications: (state: StateTree): app.AppNotification[] =>
        state.notifications,
    },

    actions: {
      loadDefaultNotifications(): void {
        //TODO: Delete this, this is just a test
        this.notifications = [
          {
            id: uuidv4(),
            title: '',
            message: 'Admin ha actualizado un dispositivo',
            caption: 'Hace 3 minutos',
            color: 'secondary',
            position: 'top-right',
          },
          {
            id: uuidv4(),
            title: '',
            message: 'User ha creado una calificación',
            caption: 'Hace 5 minutos',
            color: 'green-9',
            position: 'top-right',
          },
          {
            id: uuidv4(),
            title: '',
            message: 'Admin ha deshabilitado un usuario',
            caption: 'Hace 25 minutos',
            color: 'negative',
            position: 'top-right',
          },
          {
            id: uuidv4(),
            title: '',
            message: 'Admin ha actualizado un dispositivo',
            caption: 'Hace 3 minutos',
            color: 'secondary',
            position: 'top-right',
          },
          {
            id: uuidv4(),
            title: '',
            message: 'User ha creado una calificación',
            caption: 'Hace 5 minutos',
            color: 'green-9',
            position: 'top-right',
          },
          {
            id: uuidv4(),
            title: '',
            message: 'Admin ha deshabilitado un usuario',
            caption: 'Hace 25 minutos',
            color: 'negative',
            position: 'top-right',
          },
        ];
      },

      saveNotifications(): void {
        storage.setNotifications(this.notifications);
      },

      addNewNotification(notification: app.AppNotification): void {
        this.notifications.unshift(notification);
        this.saveNotifications();
      },

      removeNotification(id: string): void {
        this.notifications.forEach((element: app.AppNotification) => {
          if (element.id == id) {
            this.notifications.splice(this.notifications.indexOf(element), 1);
          }
        });
        this.saveNotifications();
      },

      removeNotifications(): void {
        this.notifications.length = 0;
        storage.removeNotifications();
      },
    },
  }
);
