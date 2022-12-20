<script setup lang="ts">
import { onMounted, reactive } from 'vue';

interface tachometersColors {
  cpu: string;
  memory: string;
  disk: string;
}


interface IComponentData {
  cpu: number;
  memory: number;
  disk: number;
  color: tachometersColors;
  centerColor: tachometersColors;
  tackColor: tachometersColors;
}

const componentData: IComponentData = reactive({
  cpu: 0,
  memory: 0,
  disk: 0,
  color: {
    cpu: 'green-9',
    memory: 'green-9',
    disk: 'green-9'
  },
  centerColor: {
    cpu: 'green-1',
    memory: 'green-1',
    disk: 'green-1'
  },
  tackColor: {
    cpu: 'green-3',
    memory: 'green-3',
    disk: 'green-3'
  },
})

defineExpose({
  tachometers
})

function tachometers(): void {
  componentData.cpu = Math.floor(Math.random() * 100);
  componentData.memory = Math.floor(Math.random() * 100);
  componentData.disk = Math.floor(Math.random() * 100);
  console.log(componentData.cpu)

  if (componentData.cpu >= 60 && componentData.cpu < 80) {
    componentData.color.cpu = 'amber-9';
    componentData.centerColor.cpu = 'amber-1';
    componentData.tackColor.cpu = 'amber-1';
  }
  if (componentData.memory >= 60 && componentData.memory < 80) {
    componentData.color.memory = 'amber-9';
    componentData.centerColor.memory = 'amber-1';
    componentData.tackColor.memory = 'amber-1';
  }
  if (componentData.disk >= 60 && componentData.disk < 80) {
    componentData.color.disk = 'amber-9';
    componentData.centerColor.disk = 'amber-1';
    componentData.tackColor.disk = 'amber-1';
  }
  if (componentData.cpu >= 80 && componentData.cpu < 90) {
    componentData.color.cpu = 'deep-orange-9';
    componentData.centerColor.cpu = 'deep-orange-1';
    componentData.tackColor.cpu = 'deep-orange-3';
  }
  if (componentData.memory >= 80 && componentData.memory < 90) {
    componentData.color.memory = 'deep-orange-9';
    componentData.centerColor.memory = 'deep-orange-1';
    componentData.tackColor.memory = 'deep-orange-3';
  }
  if (componentData.disk >= 80 && componentData.disk < 90) {
    componentData.color.disk = 'deep-orange-9';
    componentData.centerColor.disk = 'deep-orange-1';
    componentData.tackColor.disk = 'deep-orange-3';
  }
  if (componentData.cpu > 90) {
    componentData.color.cpu = 'red-9';
    componentData.centerColor.cpu = 'red-1';
    componentData.tackColor.cpu = 'red-3';
  }
  if (componentData.memory > 90) {
    componentData.color.memory = 'red-9';
    componentData.centerColor.memory = 'red-1';
    componentData.tackColor.memory = 'red-3';
  }
  if (componentData.disk > 90) {
    componentData.color.disk = 'red-9';
    componentData.centerColor.disk = 'red-1';
    componentData.tackColor.disk = 'red-3';
  }
}
onMounted(async () => {
  tachometers();
});
</script>

<template>
  <div>
    CPU
    <q-knob id="cpu-knob" v-model="componentData.cpu" show-value disable size="60px" :color="componentData.color.cpu"
      :center-color="componentData.centerColor.cpu" :track-color="componentData.tackColor.cpu" class="col">{{
      componentData.cpu}}%</q-knob>
  </div>
  <div>
    memory
    <q-knob id="memory-knob" v-model="componentData.memory" show-value disable size="60px"
      :color="componentData.color.memory" :center-color="componentData.centerColor.memory"
      :track-color="componentData.tackColor.memory" class="col">{{ componentData.memory }}%</q-knob>
  </div>
  <div>
    disk
    <q-knob id="disk-knob" v-model="componentData.disk" show-value disable size="60px" :color="componentData.color.disk"
      :center-color="componentData.centerColor.disk" :track-color="componentData.tackColor.disk" class="col">{{
      componentData.disk }}%</q-knob>
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