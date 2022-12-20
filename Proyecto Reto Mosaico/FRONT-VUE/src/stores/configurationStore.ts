import { AxiosResponse } from 'axios';
import { defineStore, StateTree, StoreDefinition } from 'pinia';
import { configInitial } from 'src/boot/ConfigInitialSetup';
import { node } from 'src/interfaces';
import { ConfigService } from 'src/services';
import { storage, notifications } from 'src/common';
import { statusErrorEnums } from 'src/enums';

export const ConfigurationStore: StoreDefinition = defineStore(
  'ConfigurationStore',
  {
    state: () => ({
      configuration: { ...storage.getConfig() },
      configurationChanges: { ...storage.getConfig() },
    }),

    getters: {
      getConfiguration: (state: StateTree) => state.configuration,
      getConfigurationChanges: (state: StateTree) => state.configurationChanges,
    },

    actions: {
      setConfigurationItem(itemValue: string, itemName: string): void {
        this.configurationChanges[itemName] = itemValue;
      },

      restoreConfigurationItem(itemName: string): void {
        this.configurationChanges[itemName] = this.configuration[itemName];
      },

      restoreConfiguration(): void {
        this.configurationChanges = { ...this.configuration };
      },

      resetConfigurationFromStorage(): void {
        this.configuration = { ...storage.getConfig() };
        this.configurationChanges = { ...storage.getConfig() };
      },

      async restoreInitialConfiguration(): Promise<void> {
        this.configuration = { ...configInitial };
        this.configurationChanges = { ...configInitial };
        await this.saveConfiguration();
      },

      checkChanges(): boolean {
        let pendingChanges = false;
        const keys: string[] = Object.keys(this.configuration);
        for (let i = 0; i < keys.length; i++) {
          if (
            this.configuration[keys[i]] !== this.configurationChanges[keys[i]]
          ) {
            if (keys[i] == 'modules') {
              if (this.checkModuleChanges()) {
                pendingChanges = true;
              }
            } else {
              pendingChanges = true;
            }
          }
        }
        return pendingChanges;
      },

      checkModuleChanges(): boolean {
        let pendingChanges = false;
        const keys: string[] = Object.keys(this.configuration.modules[0]);
        for (let i = 0; i < this.configuration.modules.length; i++) {
          for (let j = 0; j < keys.length; j++) {
            if (
              this.configuration.modules[i][keys[j]] !==
              this.configurationChanges.modules[i][keys[j]]
            ) {
              pendingChanges = true;
            }
          }
        }
        return pendingChanges;
      },
      async saveConfiguration() {
        this.configuration = { ...this.configurationChanges };
        try {
          const updateConfig: AxiosResponse<node.Config> =
            await ConfigService.updateConfig(
              storage.getAuthenticatedUser().nit,
              this.configuration
            );
          storage.setConfig(updateConfig.data);
        } catch (err: any) {
          if (err.response.status == statusErrorEnums.statusErrorEnums.notFound) {
            try {
              const configuration: AxiosResponse<node.Config> =
                await ConfigService.createConfig({
                  ...this.configuration,
                  nit: storage.getAuthenticatedUser().nit,
                });
              storage.setConfig(configuration.data);
            } catch (err: any) {
              notifications.showErrorNotification(
                `Ha ocurrido un error: ${err.response.data.message}`
              );
            }
          } else {
            notifications.showErrorNotification(
              `Ha ocurrido un error: ${err.response.data.message}`
            );
          }
        }
      },
    },
  }
);
