<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { node, tableRows } from 'src/interfaces';
import { usersColumns } from '../data';
import {
  WebSocketNodeService,
  UserService,
} from 'src/services/';
import { Socket } from 'socket.io-client';
import { notifications, exportData } from 'src/common';
import { QTableProps } from 'quasar';
import { AxiosResponse } from 'axios';

interface IComponentData {
  socket: Socket | null;
  title: string;
  columns: QTableProps['columns'];
  rows: tableRows.UserRow[];
  filter: string;
  loading: boolean[];
}

const componentData: IComponentData = reactive({
  socket: null,
  title: 'Usuarios',
  columns: usersColumns(),
  rows: [],
  filter: '',
  loading: [false],
})

function editRow(email: string): void {
  console.log(email);
};

function loadingDone(): void {
  setTimeout(() => {
    componentData.loading[0] = false;
  }, 1000);
};

function filterRows(filter: string): tableRows.UserRow[] {
  const data = filter
    ? componentData.rows.filter(
      (row: tableRows.UserRow) =>
        row.email.includes(filter) ||
        row.name.includes(filter) ||
        String(row.idCard).includes(filter)
    )
    : componentData.rows.slice();
  return data;
};

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
    const response: AxiosResponse<node.User[]> = await UserService.getUsers();
    response.data.forEach((user: node.User) => {
      componentData.rows.push({
        id: user._id,
        name: user.name,
        idCard: user.idCard,
        email: user.email,
        phone: user.phone,
        position: user.position,
      });
    });

    componentData.socket = WebSocketNodeService.createWebSocketConnection(
      'user',
      componentData.rows,
      componentData.loading
    );
  } catch (err: any) {
    notifications.showErrorNotification(err.response.data.message);
  };
  loadingDone();
});

onBeforeUnmount((): void => {
  if (componentData.socket) WebSocketNodeService.closeWebSocketConnection(componentData.socket);
});
</script>

<template>
  <q-table id="user-table" :title="componentData.title" :rows="componentData.rows" :columns="componentData.columns"
    row-key="email" separator="cell" :rowsPerPageOptions="[10, 20, 30, 40, 50]" :filter="componentData.filter"
    @request="onRequest" :loading="componentData.loading[0]" loading-label="Cargando..."
    no-data-label="No se encontraron registros">
    <template v-slot:top-right>
      <q-input dense debounce="300" v-model="componentData.filter" placeholder="Buscar usuario" class="q-mx-xl">
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
      <q-tr :props="props" :id="`user_${props.cols[0].value}`">
        <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td auto-width class="row-inline">
          <span class="edit-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Editar usuario
            </q-tooltip>
            <q-btn size="sm" color="warning" round dense @click="editRow(props.row.email)" icon="edit" />
          </span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style>
#user-table {
  box-shadow: none !important;
}

.q-dialog {
  border: 2px solid #9c27b0;
}
</style>