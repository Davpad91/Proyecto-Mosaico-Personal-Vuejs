import { RouteLocationNormalized } from 'vue-router';
import { ConfigurationStore } from 'src/stores/';
import { Module } from 'src/interfaces/app';

export function isEnabledToEnter(
  to: RouteLocationNormalized
): { name: string } | undefined {
  const configurationStore = ConfigurationStore.ConfigurationStore();
  const modules: Module[] | undefined =
    configurationStore.getConfiguration.modules;
  if (!modules) return { name: 'not-found' };

  let encountered = false;
  let active = true;

  modules.forEach((element: Module) => {
    if (element.url == to.name) {
      encountered = true;
      if (!element.isActive) active = false;
    }
  });

  if (!encountered) return { name: 'not-found' };
  if (!active) return { name: 'forbidden' };
}
