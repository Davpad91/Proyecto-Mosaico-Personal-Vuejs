<script setup lang="ts">
import { notifications, random } from 'src/common';
import { node } from 'src/interfaces';
import { RoleService } from 'src/services';
import { onMounted, Ref, ref } from 'vue';

const name: Ref<string> | null = ref('');
const email: Ref<string> | null = ref('');
const phone: Ref<string> | null = ref('');
const position: Ref<string> | null = ref('');
const idCard: Ref<string> | null = ref('');
const rol: Ref<string> = ref('');
const roles = ref<node.Role[]>([] as node.Role[]);
const confirm: Ref<boolean> = ref(false);
const temppassword: Ref<string> = ref('');
const isPwdR: Ref<boolean> = ref(true);
const loading: Ref<boolean[]> = ref([false]);

function randomPassword(): void {
  temppassword.value = random.generateRandomPassword();
};

onMounted(async (): Promise<void> => {
  loading.value[0] = true;
  try {
    const response = await RoleService.getRoles();
    const rolesList: node.Role[] = response.data;
    roles.value.length = 0;
    rolesList.forEach((role) => {
      roles.value.push({
        id: role._id,
        _id: role._id,
        name: role.name,
        description: role.description,
        hierarchy: role.hierarchy,
      });
    });
  } catch (err: any) {
    notifications.showErrorNotification(err.response.data.message);
  }
});

</script>
<template>
  <div class="q-pa-md q-gutter-md">
    <div class="text-h6">
      Datos del Nuevo Usuario
    </div>
    <div class="row">
      <div class="col q-pb-sm">
        <q-input class="q-pb-md" clearable filled color="primary" v-model="name" label="Nombre Completo del Usuario">
          <template v-slot:append>
            <q-avatar icon="description" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-input class="q-pb-md" clearable filled color="primary" v-model="idCard" label="Numero de identificacion"
          maxlength="10">
          <template v-slot:append>
            <q-avatar icon="fingerprint" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-input class="q-pb-md" clearable filled color="primary" v-model="email"
          label="Correo electronico del usuario">
          <template v-slot:append>
            <q-avatar icon="email" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-input class="q-pb-md" clearable filled color="primary" v-model="phone"
          label="Numero de telefono del usuario">
          <template v-slot:append>
            <q-avatar icon="contact_phone" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
      </div>
      <div class="col q-pl-sm">
        <q-input class="q-pb-md" clearable filled :type="isPwdR ? 'password' : 'text'" color="primary"
          v-model="temppassword" label="Contraseña temporal del usuario">
          <template v-slot:append>
            <q-icon :name="isPwdR ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdR = !isPwdR" />
            <q-avatar icon="lock" color="white" text-color="black" size="md" @click="randomPassword">
              <q-tooltip class="bg-indigo">
                Haz click para generar una contraseña aleatoria
              </q-tooltip>
            </q-avatar>
          </template>
        </q-input>
        <q-input class="q-pb-md" clearable filled color="primary" v-model="position" label="Cargo del usuario">
          <template v-slot:append>
            <q-avatar icon="badge" color="white" text-color="black" size="xl" />
          </template>
        </q-input>
        <q-select class="q-pb-md" clearable hide-dropdown-icon filled color="primary" v-model="rol"
          :options="roles.map((role) => role.name)" label="Rol del Usuario" options-cover>
          <template v-slot:append>
            <q-avatar icon="privacy_tip" color="white" text-color="black" size="xl" />
          </template>
        </q-select>
      </div>
    </div>
    <div class="">
      <q-btn flat label="Cancelar" v-close-popup icon="cancel" color="red" @click="
        () => {
          name = '';
          idCard = '';
          email = '';
          phone = '';
          position = '';
          temppassword = '';
        }
      " />
      <q-btn label="Crear Usuario" @click="confirm = true" icon-right="person_add" color="primary" />
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="task_alt" color="primary" text-color="white" />
            <span class="q-ml-sm">¿Esta seguro de los datos ingresados?</span>
          </q-card-section>

          <q-card-actions class="float-right">
            <q-btn flat label="Cancelar" color="red" v-close-popup icon="cancel" />
            <q-btn flat label="Confirmar" color="primary" icon-right="check_circle" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<style>

</style>