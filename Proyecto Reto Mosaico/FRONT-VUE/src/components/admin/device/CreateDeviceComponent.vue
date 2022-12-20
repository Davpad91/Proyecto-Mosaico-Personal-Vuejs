<script setup lang="ts">
import { reactive } from 'vue'
import { django } from 'src/interfaces';

interface IComponentData {
  device: django.Device;
  confirm: boolean;
  os_name: string[];
  os_version: string[];
  connection_type: string[];
  type_processor: string[];
  processor_quantity: string[];
  disk_type: string[];
  disk_size: string[];
  ram: string[];
  brand: string[];
}

const componentData: IComponentData = reactive({
  device: {} as django.Device,
  confirm: false,
  os_name: [
    'Microsoft Windows',
    'Linux RedHat',
    'Linux Ubuntu',
    'Linux Archlinux',
    'Linux ElementaryOS',
    'Kali Linux',
    'Mac OS',
  ],
  os_version: [
    '10 Pro',
    '10 Home',
    '10 Enterprise',
  ],
  connection_type: ['Ethernet', 'Wifi'],
  type_processor: [
    'Intel Celeron',
    'Intel Core I3',
    'Intel Core I5',
    'Intel Core I7',
    'Intel Core I9',
    'AMD Athlon',
    'AMD Ryzen 3',
    'AMD Ryzen 5',
    'AMD Ryzen 7',
    'AMD A3',
    'AMD A6',
    'AMD A9',
    'AMD A12',
  ],
  processor_quantity: ['1', '2', '4', '6'],
  disk_type: ['SSD', 'HDD'],
  disk_size: [
    '128 GB',
    '256 GB',
    '512 GB ',
    '1024 GB',
    '2048 GB',
    '4096 GB',
  ],
  ram: ['4', '8', '12', '16', '32', '64'],
  brand: [
    'Hp',
    'Lenovo',
    'Acer',
    'Apple',
    'Samsung',
    'Huawei',
    'Xiaomi',
    'Sony',
    'Asus',
    'Toshiba',
    'Dell',
    'MSI',
    'Otro',
  ],
});

function newDevice(): void {
  const deviceNew: django.Device = componentData.device;
  console.log(deviceNew);
}

</script>
<template>
  <div class="max-width q-mt-sm">
    <div class="text-h6 q-ml-sm">
      <p>Insertar datos del nuevo dispositivo</p>
    </div>
    <p class="text-bold q-pl-md q-mb-none">
      Informacion básica
    </p>
    <div class="row q-pa-sm">
      <div class="col q-pr-sm">
        <q-input filled color="primary" v-model="componentData.device.user" label="Email del Usuario" focus
          class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="portrait" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-input filled color="primary" v-model="componentData.device.device_name" label="Nombre del Equipo"
          class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="perm_identity" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-select clearable hide-dropdown-icon filled color="primary" v-model="componentData.device.brand"
          :options="componentData.brand" label="Marca" class="create-device-input" options-cover>
          <template v-slot:append>
            <q-avatar icon="local_offer" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
      </div>
      <div class="col q-pl-sm">
        <q-input filled color="primary" v-model="componentData.device.model" label="Modelo" class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="style" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-input filled color="primary" v-model="componentData.device.serial" label="Serial"
          class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="numbers" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
      </div>
    </div>
    <p class="text-bold q-pl-md q-mb-none">
      Informacion de red
    </p>
    <div class="row q-pa-sm">
      <div class="col q-pr-sm">
        <q-select clearable hide-dropdown-icon filled color=" primary" v-model="componentData.device.connection_type"
          :options="componentData.connection_type" label="Tipo de Conexión" class="create-device-input" options-cover>
          <template v-slot:append>
            <q-avatar icon="cell_wifi" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
        <q-input filled color="primary" v-model="componentData.device.ipv4" label="Dirección IP"
          class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="router" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
      </div>
      <div class="col q-pl-sm">
        <q-input filled color="primary" v-model="componentData.device.host_name" label="Nombre de Host"
          class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="gite" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-input filled color="primary" v-model="componentData.device.nic_name" label="Interfaz de Red"
          class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="settings_ethernet" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
      </div>
    </div>
    <p class="text-bold q-pl-md q-mb-none">
      Informacion técnica
    </p>
    <div class="row q-pa-sm">
      <div class="col q-pr-sm">
        <q-select clearable filled hide-dropdown-icon color="primary" v-model="componentData.device.os_name"
          :options="componentData.os_name" label="Sistema Operativo" class="create-device-input" options-cover>
          <template v-slot:append>
            <q-avatar icon="dvr" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
        <q-select clearable filled hide-dropdown-icon color="primary" v-model="componentData.device.os_version"
          :options="componentData.os_version" label="Version del Sistema Operativo" class="create-device-input"
          options-cover>
          <template v-slot:append>
            <q-avatar icon="list_alt" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
        <q-select clearable hide-dropdown-icon filled color="primary" v-model="componentData.device.processor"
          :options="componentData.type_processor" label="Tipo de Procesador" class="create-device-input" options-cover>
          <template v-slot:append>
            <q-avatar icon="dynamic_form" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
        <q-select clearable hide-dropdown-icon filled color="primary" v-model="componentData.device.processor_quantity"
          :options="componentData.processor_quantity" label="Procesador(es)" class="create-device-input" options-cover>
          <template v-slot:append>
            <q-avatar icon="settings_applications" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
      </div>
      <div class="col q-pl-sm">
        <q-select clearable hide-dropdown-icon filled color="primary" v-model="componentData.device.ram"
          :options="componentData.ram" label="Memoria Total" class="create-device-input" options-cover>
          <template v-slot:append>
            <q-avatar icon="dns" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
        <q-select clearable hide-dropdown-icon filled color="primary" v-model="componentData.device.disk_type"
          :options="componentData.disk_type" label="Tipo de Disco" class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="ballot" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
        <q-select clearable hide-dropdown-icon filled color="primary" v-model="componentData.device.disk_size"
          :options="componentData.disk_size" label="Tamaño del Disco" class="create-device-input">
          <template v-slot:append>
            <q-avatar icon="archive" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
      </div>
    </div>
    <div class="q-mt-sm">
      <q-btn flat label="Cancelar" v-close-popup icon="cancel" color="red" @click="
      	() => {
      		componentData.device.user = '';
      		componentData.device.device_name = '';
      		componentData.device.os_name = '';
      		componentData.device.ram = 8;
      		componentData.device.brand = '';
      		componentData.device.model = '';
      		componentData.device.serial = '';
      	}
      " />
      <q-btn label="Crear dispositivo" @click="componentData.confirm = true" icon-right="save" color="primary" />
      <q-dialog v-model="componentData.confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="task_alt" color="primary" text-color="white" />
            <span class="q-ml-sm">¿Esta seguro de los datos ingresados?</span>
          </q-card-section>

          <q-card-actions class="float-right">
            <q-btn flat label="Cancelar" color="red" icon="cancel" v-close-popup />
            <q-btn flat label="Confirmar" color="primary" icon-right="check_circle" v-close-popup
              @click="newDevice()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<style>
.create-device-input {
  margin: 6px !important;
}
</style>