<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { node, tableRows } from 'src/interfaces';
import { WebSocketNodeService, RoleService } from 'src/services/';
import { rolesColumns } from '../data';
import { notifications, exportData, tableRowDetails } from 'src/common';
import { Socket } from 'socket.io-client';
import { QTableProps } from 'quasar';
import { AxiosResponse } from 'axios';

interface IComponentData {
  socket: Socket | null;
  title: string;
  columns: QTableProps['columns'];
  rows: tableRows.RoleRow[];
  filter: string;
  loading: boolean[];
}

const componentData: IComponentData = reactive({
  socket: null,
  title: 'Roles',
  columns: rolesColumns(),
  rows: [],
  filter: '',
  loading: [false],
})

function editRow(id: string): void {
  console.log(id);
};

function deleteRow(id: string): void {
  console.log(id);
};

function loadingDone(): void {
  setTimeout(() => {
    componentData.loading[0] = false;
  }, 1000);
};

function filterRows(filter: string): tableRows.RoleRow[] {
  const data = filter
    ? componentData.rows.filter((row: any) => row.name.includes(filter))
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
    const response: AxiosResponse<node.Role[]> = await RoleService.getRoles();
    response.data.forEach((role: node.Role) => {
      componentData.rows.push({
        id: role._id,
        name: role.name,
        description: role.description,
        hierarchy: tableRowDetails.resolveHierarchy(role.hierarchy),
      });
    });

    componentData.socket = WebSocketNodeService.createWebSocketConnection(
      'role',
      componentData.rows,
      componentData.loading
    );
  } catch (err: any) {
    notifications.showErrorNotification(err.response.data.message);
  }
  loadingDone();
});

onBeforeUnmount((): void => {
  if (componentData.socket) WebSocketNodeService.closeWebSocketConnection(componentData.socket);
});
</script>

<template>
  <q-table id="role-table" :title="componentData.title" :rows="componentData.rows" :columns="componentData.columns"
    row-key="id" separator="cell" :rowsPerPageOptions="[10, 20, 30, 40, 50]" :filter="componentData.filter"
    @request="onRequest" :loading="componentData.loading[0]" loading-label="Cargando..."
    no-data-label="No se encontraron registros">
    <template v-slot:top-right>
      <div class="hierarchies row q-mr-xl">
        <div class="hierarchy-range column items-center text-light-green-9">
          <span class="material-icons">shield </span>
          <span class="hierarchy-description">Básico</span>
        </div>
        <div class="hierarchy-range column items-center text-amber-10">
          <span class="material-icons">policy </span>
          <span class="hierarchy-description">Estándar</span>
        </div>
        <div class="hierarchy-range column items-center text-cyan-10">
          <span class="material-icons"> local_police </span>
          <span class="hierarchy-description">Superior</span>
        </div>
        <div class="hierarchy-range column items-center text-red-14">
          <span class="material-icons">security</span>
          <span class="hierarchy-description">Control total</span>
        </div>
      </div>
      <q-input dense debounce="300" v-model="componentData.filter" placeholder="Buscar rol" class="q-mx-xl">
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
        <q-th auto-width>
          <span class="add-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Crear nuevo rol
            </q-tooltip>
            <q-btn size="sm" color="primary" round dense icon="add" />
          </span>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" :id="`role_${props.cols[0].value}`">
        <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
          <span v-if="col.name == 'hierarchy'" :class="
            'hierarchy-icon-value' + ' material-icons' + ` ${col.value.color}`
          ">
            {{ col.value.icon }}
          </span>
          <span v-else>{{ col.value }}</span>
        </q-td>
        <q-td auto-width class="row-inline">
          <span class="edit-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Editar rol
            </q-tooltip>
            <q-btn size="sm" color="warning" round dense @click="editRow(props.row.id)" icon="edit" />
          </span>
          &nbsp;
          <span class="remove-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Eliminar rol
            </q-tooltip>
            <q-btn size="sm" color="negative" round dense @click="deleteRow(props.row.id)" icon="delete" />
          </span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style>
#role-table {
  box-shadow: none !important;
}

.hierarchies {
  gap: 20px;
}

.hierarchy-range {
  width: fit-content;
  padding: 0 10px;
  margin: 0 10px;
}

/* .hierarchy-range .fa-solid, */
.hierarchy-range .material-icons,
.hierarchy-icon-value {
  font-size: 24px;
}

.hierarchy-range .hierarchy-description {
  font-size: 12px;
}
</style>