<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { storage, notifications } from 'src/common';
import options from '../auth/questions';
import { AccountService } from 'src/services';
import { node, app } from 'src/interfaces';
import { AxiosResponse } from 'axios';

const authenticatedUser: app.UserInfo | null = storage.getAuthenticatedUser();

interface IComponentData {
  user: app.UserInfo;
}

const componentData: IComponentData = reactive({
  user: authenticatedUser ? authenticatedUser : {} as app.UserInfo,
});

const options1: string[] = options.options1;
const options2: string[] = options.options2;
const options3: string[] = options.options3;
const options4: string[] = options.options4;

async function updatedQuestions(): Promise<void> {
  try {
    if (componentData.user.answer1 || componentData.user.answer2 || componentData.user.answer3 || componentData.user.answer4) {
      const userUpdate: node.UserUpdate = {
        id: componentData.user.id,
        phone: componentData.user.phone,
        answer1: componentData.user.answer1,
        answer2: componentData.user.answer2,
        answer3: componentData.user.answer3,
        answer4: componentData.user.answer4,
        question1: componentData.user.question1,
        question2: componentData.user.question2,
        question3: componentData.user.question3,
        question4: componentData.user.question4
      };

      const response: AxiosResponse<node.User> = await AccountService.updateUser(userUpdate);
      componentData.user.answer1 = '';
      componentData.user.answer2 = '';
      componentData.user.answer3 = '';
      componentData.user.answer4 = '';
      componentData.user.question1 = response.data.question1;
      componentData.user.question2 = response.data.question2;
      componentData.user.question3 = response.data.question3;
      componentData.user.question4 = response.data.question4;
      storage.updateUser(response.data, ['answer1', 'answer2', 'answer3', 'answer4', 'question1', 'question2', 'question3', 'question4']);

      notifications.showSuccessNotification('Cambios guardados correctamente');
    }
  } catch (error: any) {
    notifications.showErrorNotification(error.response.data.message);
  };
}

onBeforeMount(() => {
  componentData.user.answer1 = '';
  componentData.user.answer2 = '';
  componentData.user.answer3 = '';
  componentData.user.answer4 = '';
});
</script>

<template>
  <div class="q-pa-xl">
    <div>
      <h5 class="q-ma-xs text-bold">Perfil de usuario</h5>
      <p class="q-ml-xs text-italic">
        Edita tus preguntas de seguridad en esta página
      </p>
      <hr />
      <h4 class="q-ma-xs text-center text-primary text-bold">
        Preguntas de seguridad
        <q-icon name="description" />
      </h4>
    </div>
    <q-form>
      <div class="row">
        <div class="col-6 q-pa-sm">
          <div class="q-pb-md">
            <q-select bg-color="grey-4" filled v-model="componentData.user.question1" :options="options1"
              label="Pregunta #1" />
            <q-input filled v-model="componentData.user.answer1" label="Respuesta" />
          </div>
          <div class="q-pb-md">
            <q-select bg-color="grey-4" filled v-model="componentData.user.question2" :options="options2"
              label="Pregunta #2" />
            <q-input filled v-model="componentData.user.answer2" label="Respuesta" />
          </div>
        </div>
        <div class="col-6 q-pa-sm">
          <div class="q-pb-md">
            <q-select bg-color="grey-4" filled v-model="componentData.user.question3" :options="options3"
              label="Pregunta #3" />
            <q-input filled v-model="componentData.user.answer3" label="Respuesta" />
          </div>
          <div class="q-pb-md">
            <q-select bg-color="grey-4" filled v-model="componentData.user.question4" :options="options4"
              label="Pregunta #4" />
            <q-input filled v-model="componentData.user.answer4" label="Respuesta" />
          </div>
        </div>
      </div>
      <div>
        <q-tooltip class="text-body2 shadow-4" anchor="top right" self="bottom right" transition-show="scale"
          transition-hide="scale">
          Con el boton "Guardar cambios"<br />
          podrás guardar las nuevas preguntas <br />
          y respuestas que creaste.
        </q-tooltip>
        <q-btn round icon="help" class="float-right" color="primary" />
      </div>
      <div>
        <q-btn label="Guardar cambios" icon="edit_note" color="primary" class="float-right q-mr-sm"
          @click.prevent="updatedQuestions()" />
      </div>
    </q-form>
  </div>
</template>
