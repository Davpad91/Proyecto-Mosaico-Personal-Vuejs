<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { django, tableRows } from 'src/interfaces';
import { RatingService, WebSocketDjangoService } from 'src/services';
import { ratingsColumns } from '../data';
import { notifications, exportData } from 'src/common';
import { QTableProps } from 'quasar';
import { AxiosResponse } from 'axios';

interface IComponentData {
  socket: WebSocket | null;
  title: string;
  columns: QTableProps['columns'];
  rows: tableRows.RatingRow[];
  loading: boolean[];
}

const componentData: IComponentData = reactive({
  socket: null,
  title: 'Calificaciones',
  columns: ratingsColumns(),
  rows: [],
  loading: [false],
});

function loadingDone(): void {
  setTimeout(() => {
    componentData.loading[0] = false;
  }, 1000);
}

function exportTable(): void {
  exportData.exportDataFromTable(componentData.columns, componentData.rows, componentData.title);
}

onMounted(async (): Promise<void> => {
  componentData.loading[0] = true;

  try {
    const response: AxiosResponse<django.Rating[]> = await RatingService.getRatings()
    response.data.forEach((rating) => {
      componentData.rows.push({
        id: rating.id,
        user: rating.user,
        grade: rating.grade,
        description: rating.description,
        date: rating.date,
        time: rating.time,
      });
    });

    componentData.socket = WebSocketDjangoService.createWebSocketConnection(
      'rating',
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
  <q-table id="ratings-table" :title="componentData.title" :rows="componentData.rows" :columns="componentData.columns"
    row-key="id" separator="cell" :rowsPerPageOptions="[10, 20, 30, 40, 50]" :loading="componentData.loading[0]"
    loading-label="Cargando..." no-data-label="No se encontraron registros">
    <template v-slot:top-right>
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
        <q-th auto-width>
          <span class="statistics-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              Ver estadísticas
            </q-tooltip>
            <q-btn size="sm" color="primary" round dense icon="addchart" />
          </span>
        </q-th>
        <q-th v-for="col in props.cols.slice(2)" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" :id="`rating-${props.cols[0].value}`">
        <q-td auto-width>
          <span class="statistics-button">
            <q-tooltip class="text-body2" anchor="center left" self="center right" :offset="[10, 10]">
              {{ props.expand ? 'Ocultar descripción' : 'Mostrar descripción' }}
            </q-tooltip>
            <q-btn size="sm" color="secondary" round dense @click="props.expand = !props.expand"
              :icon="props.expand ? 'expand_less' : 'expand_more'" />
          </span>
        </q-td>
        <q-td v-for="col in props.cols.slice(2)" :key="col.name" :props="props">
          <span v-if="col.name == 'grade'" :id="col.name">
            <span v-for="index in col.value" :key="index" class="grade-star-icon material-icons text-amber-8">
              star
            </span>
          </span>
          <span v-else :id="col.name">{{ col.value }}</span>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">{{ props.row.description }}</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style>
#ratings-table {
  box-shadow: none !important;
}

.grade-star-icon {
  font-size: 24px;
}
</style>