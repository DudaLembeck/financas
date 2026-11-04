<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>Criar conta</h1>

      <ion-input v-model="email" type="email" label="E-mail" label-placement="floating" fill="outline"
        :class="{ 'ion-invalid ion-touched': erroEmail }" error-text="E-mail inválido" />

      <ion-input v-model="senha" type="password" label="Senha" label-placement="floating" fill="outline"
        class="ion-margin-top" :class="{ 'ion-invalid ion-touched': erroSenha }" error-text="Mínimo de 6 caracteres" />

      <ion-input v-model="confirmacao" type="password" label="Confirmar senha" label-placement="floating" fill="outline"
        class="ion-margin-top" :class="{ 'ion-invalid ion-touched': erroConfirmacao }" error-text="As senhas não coincidem" />

      <ion-button expand="block" class="ion-margin-top" :disabled="!valido || carregando" @click="criarConta">
        Cadastrar
      </ion-button>
      <ion-button expand="block" fill="clear" router-link="/login">Já tenho conta</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonContent, IonInput, IonButton, toastController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { signUp: cadastrar } = useAuth();

const email = ref('');
const senha = ref('');
const confirmacao = ref('');
const carregando = ref(false);

const emailOk = computed(() => /^\S+@\S+\.\S+$/.test(email.value));
const senhaOk = computed(() => senha.value.length >= 6);
const confirmacaoOk = computed(() => confirmacao.value === senha.value);

const erroEmail = computed(() => email.value !== '' && !emailOk.value);
const erroSenha = computed(() => senha.value !== '' && !senhaOk.value);
const erroConfirmacao = computed(() => confirmacao.value !== '' && !confirmacaoOk.value);
const valido = computed(() => emailOk.value && senhaOk.value && confirmacaoOk.value && confirmacao.value !== '');

async function mostrarMensagem(message: string, color: 'danger' | 'success'): Promise<void> {
  const toast = await toastController.create({ message, duration: 3500, color });
  await toast.present();
}

async function criarConta(): Promise<void> {
  carregando.value = true;
  try {
    const logado = await cadastrar(email.value, senha.value);
    if (logado) {
      router.replace('/dashboard');
    } else {
      await mostrarMensagem('Conta criada! Confirme seu e-mail para entrar.', 'success');
      router.replace('/login');
    }
  } catch (e) {
    await mostrarMensagem(e instanceof Error ? e.message : 'Erro ao cadastrar', 'danger');
  } finally {
    carregando.value = false;
  }
}
</script>