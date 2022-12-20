<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { django, tableRows } from 'src/interfaces';
import { DeviceService, WebSocketDjangoService } from 'src/services';
import { devicesColumns } from '../data';
import { notifications, exportData } from 'src/common';
import { QTableProps } from 'quasar';
import { AxiosResponse } from 'axios';

interface IComponentData {
  socket: WebSocket | null;
  title: string;
  columns: QTableProps['columns'];
  rows: tableRows.DeviceRow[];
  filter: string;
  loading: boolean[];
}

const componentData: IComponentData = reactive({
  socket: null,
  title: 'Dispositivos',
  columns: devicesColumns(),
  rows: [],
  filter: '',
  loading: [false],
})

function editRow(device_name: string): void {
  console.log(device_name);
}

function deleteRow(device_name: string): void {
  console.log(device_name);
}

function loadingDone(): void {
  setTimeout(() => {
    componentData.loading[0] = false;
  }, 1000);
}

function filterRows(filter: string): tableRows.DeviceRow[] {
  const data = filter
    ? componentData.rows.filter((row: tableRows.DeviceRow) => row.device_name.includes(filter))
    : componentData.rows.slice();
  return data;
}

function onRequest(props: QTableProps): void {
  const filter = props.filter;
  componentData.rows = filterRows(filter);
}

function exportTable(): void {
  exportData.exportDataFromTable(componentData.columns, componentData.rows, componentData.title);
}

onMounted(async (): Promise<void> => {
  componentData.loading[0] = true;

  try {
    const response: AxiosResponse<django.Device[]> = await DeviceService.getDevices();
    response.data.forEach((device) => {
      componentData.rows.push({
        id: device.id,
        device_name: device.device_name,
        os_name: device.os_name,
        brand: device.brand,
        model: device.model,
        serial: device.serial,
      });
    });

    componentData.socket = WebSocketDjangoService.createWebSocketConnection(
      'device',
      componentData.rows,
      componentData.loading
    );
  } catch (err: any) {
    notifications.showErrorNotification(err.response.data.detail);
  }
  loadingDone();
});

onBeforeUnmount((): void => {
  if (componentData.socket) WebSocketDjangoService.closeWebSocketConnection(componentData.socket);
});
</script>

<template>
  <q-table id="devices-table" :title="componentData.title" :rows="componentData.rows" :columns="componentData.columns"
    row-key="device_name" separator="cell" :rowsPerPageOptions="[10, 20, 30, 40, 50]" :filter="componentData.filter"
    @request="onRequest" :loading="componentData.loading[0]" loading-label="Cargando..."
    no-data-label="No se encontraron registros">
    <template v-slot:top-right>
      <q-input dense debounce="300" v-model="componentData.filter" placeholder="Buscar dispositivo" class="q-mx-xl">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <span class="export-data-button">
        <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
          Exportar datos a CSV
        </q-tooltip>
        <q-btn color="primary" icon-right="archive" label="Exportar" no-caps dense @click="exportTable"
          class="q-pa-sm" />
      </span>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th auto-width />
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" :id="`device-${props.cols[0].value}`">
        <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td auto-width class="row-inline">
          <span class="edit-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Editar dispositivo
            </q-tooltip>
            <q-btn size="sm" color="warning" round dense @click="editRow(props.row.device_name)" icon="edit" />
          </span>
          &nbsp;
          <span class="remove-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Eliminar dispositivo
            </q-tooltip>
            <q-btn size="sm" color="negative" round dense @click="deleteRow(props.row.device_name)" icon="delete" />
          </span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style>
#devices-table {
  box-shadow: none !important;
}

.create-device-card {
  width: 800px !important;
  max-width: 800px !important;
  border: 2px solid silver !important;
  border-radius: 10px !important;
}

.create-device-input {
  margin: 2px !important;
}
</style>