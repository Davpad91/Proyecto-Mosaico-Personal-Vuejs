<script setup lang="ts">
import { QTableProps } from 'quasar';
import { onMounted, reactive, ref } from 'vue';
import { storage } from 'src/common';
import { app, django } from 'src/interfaces';
import { DeviceService } from 'src/services';
import TachometersComponent from './device_module-child/TachometersComponent.vue'
import { statusErrorEnums } from 'src/enums';

const authenticatedUser: app.UserInfo | null = storage.getAuthenticatedUser();

interface rowsData {
  componente: string,
  informacion: any,
}

interface IComponentData {
  tab: string;
  rows: Array<rowsData>;
  rows3: Array<rowsData>;
  rows2: Array<rowsData>;
  loading: boolean;
  noDataLabel: string;
}

const componentData: IComponentData = reactive({
  tab: 'detailsPc',
  rows: [],
  rows3: [],
  rows2: [],
  loading: false,
  noDataLabel: '',
});

const columns: QTableProps['columns'] = [
  {
    name: 'componente',
    align: 'left',
    label: 'Componente',
    field: 'componente',
  },
  {
    name: 'informacion',
    align: 'left',
    label: 'Información',
    field: 'informacion',
  },
];

const tachometers = ref()

async function getUserDevice(): Promise<void> {
  componentData.loading = true;

  try {
    componentData.rows = [];
    componentData.rows2 = [];

    const getDevice = await DeviceService.getDeviceByEmail(authenticatedUser ? authenticatedUser.email : '')
    const data = modelDevice(getDevice.data);
    const device = Object.keys(data);

    device.forEach((device: string) => {
      componentData.rows.push({
        componente: device,
        informacion: data[device as keyof typeof data],
      });

      const network = [
        'Interfaz de red',
        'Tipo de Conexión',
        'Dirección IP',
        'Nombre de Host',
      ];

      const performance = [
        'Procesador',
        'memory Total',
        'Tipo de disk',
        'Tamaño de disk',
        'Procesador(es)',
      ];

      if (network.some((e) => e === device)) {
        componentData.rows2.push({
          componente: device,
          informacion: data[device as keyof typeof data],
        });
      }

      if (performance.some((e) => e === device)) {
        componentData.rows3.push({
          componente: device,
          informacion: data[device as keyof typeof data],
        });
      }
    });
    tachometers.value.tachometers();
  } catch (err: any) {
    componentData.noDataLabel = err.response.status == statusErrorEnums.statusErrorEnums.notFound ? 'No se encontró ningún dispositivo para este usuario' : err.response.data.detail;
  }

  loadingDone();
}

function modelDevice(device: django.Device): any {
  const Device = {
    Usuario: device.user,
    'Nombre del Equipo': device.device_name,
    'Sistema Operativo': device.os_name,
    'Version del Sistema Operativo': device.os_version,
    'Interfaz de red': device.nic_name,
    'Tipo de Conexión': device.connection_type,
    'Dirección IP': device.ipv4,
    'Procesador': device.processor,
    'memory Total': `${device.ram} GB`,
    'Tipo de disk': device.disk_type == 1 ? 'HDD' : 'SSD',
    'Tamaño de disk': `${device.disk_size} GB`,
    'Nombre de Host': device.host_name,
    'Procesador(es)':
      device.processor_quantity > 1
        ? `${device.processor_quantity} procesadores instalados`
        : `${device.processor_quantity} procesadores instalados`,
    'Marca': device.brand,
    'Modelo': device.model,
    'Serial': device.serial,
  };

  return Device;
}

function loadingDone(): void {
  setTimeout(() => {
    componentData.loading = false;
  }, 1000);
}

onMounted(async () => {
  await getUserDevice();
});
</script>

<template>
  <div class="q-pa-xl q-ma-mb">
    <div class="column justify-end items-end q-mr-xl">
      <q-btn color="blue-grey-7" icon-right="info" label="Actualizar información" @click="getUserDevice()"
        class="q-pl-lg q-pr-lg">
        <q-tooltip class="bg-blue-grey-4 text-body2" :offset="[10, 10]">
          Actualiza la información del dispositivo actual
        </q-tooltip>
      </q-btn>
    </div>
    <div class="q-pa-xl q-mr-md q-ml-md">
      <div class="row">
        <div class="col-10 q-mt-md">
          <div class="text-h4 text-weight-light">Información del equipo</div>
          <div class="text-h6 text-weight-regular">
            Muestra la información básica del equipo de cómputo y algunos
            componentes de red
          </div>
        </div>
        <div class="col">
          <img src="/icon/informacionequipo.png" height="120" />
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-card>
          <q-tabs v-model="componentData.tab" inline-label class="bg-grey-3 q-pa-xs row justify-between"
            active-color="primary" indicator-color="primary" narrow-indicator>
            <div class="col-7 flex">
              <q-tab name="detailsPc" label="Información detallada" />
              <q-tab name="detailsNetwork" label="Direccionamiento IP" />
              <q-tab name="detailsPerformance" label="Rendimiento" />
            </div>
            <div class="row flex col-5 q-gutter-xl q-mb-xs">
              <tachometers-component ref="tachometers" />
            </div>
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="componentData.tab" animated>
            <q-tab-panel name="detailsPc">
              <q-table loading-label="Cargando..." :no-data-label="componentData.noDataLabel" :rows="componentData.rows"
                flat :columns="columns" row-key="name" virtual-scroll :rows-per-page-options="[0]" hide-pagination
                :loading="componentData.loading"><template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-size">
                      {{ col.label }}
                    </q-th>
                    <q-th auto-width />
                  </q-tr>
                </template></q-table>
            </q-tab-panel>
            <q-tab-panel name="detailsNetwork">
              <q-table loading-label="Cargando..." :no-data-label="componentData.noDataLabel"
                :rows="componentData.rows2" flat :columns="columns" row-key="name" virtual-scroll
                :rows-per-page-options="[0]" hide-pagination :loading="componentData.loading"><template
                  v-slot:header="props">
                  <q-tr :props="props">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-size">
                      {{ col.label }}
                    </q-th>
                    <q-th auto-width />
                  </q-tr>
                </template></q-table>
            </q-tab-panel>
            <q-tab-panel name="detailsPerformance">
              <q-table loading-label="Cargando..." :no-data-label="componentData.noDataLabel"
                :rows="componentData.rows3" flat :columns="columns" row-key="name" virtual-scroll
                :rows-per-page-options="[0]" hide-pagination :loading="componentData.loading"><template
                  v-slot:header="props">
                  <q-tr :props="props">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-size">
                      {{ col.label }}
                    </q-th>
                    <q-th auto-width />
                  </q-tr>
                </template></q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <q-page-scroller position="bottom-right" :scroll-offset="200" :offset="[30, 50]">
      <q-btn fab padding="sm" icon="keyboard_arrow_up" color="blue-grey-7" />
    </q-page-scroller>
  </div>
</template>

<style>
#cpu-knob.disabled,
#memory-knob.disabled,
#disk-knob.disabled {
  opacity: 1 !important;
}

.font-size {
  font-size: 1rem;
}
</style>