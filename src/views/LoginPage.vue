<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="wrap">
        <h1>Finanças</h1>
        <p class="sub">Entre para controlar suas receitas e despesas</p>

        <ion-input
          v-model="email"
          type="email"
          label="E-mail"
          label-placement="floating"
          fill="outline"
          autocomplete="email"
          :class="{ 'ion-invalid ion-touched': erros.email }"
          :error-text="erros.email"
        />
        <ion-input
          v-model="senha"
          type="password"
          label="Senha"
          label-placement="floating"
          fill="outline"
          autocomplete="current-password"
          class="mt"
          :class="{ 'ion-invalid ion-touched': erros.senha }"
          :error-text="erros.senha"
          @keyup.enter="entrar"
        >
          <ion-input-password-toggle slot="end" />
        </ion-input>

        <ion-button expand="block" class="mt" :disabled="loading" @click="entrar">
          <ion-spinner v-if="loading" name="dots" />
          <span v-else>Entrar</span>
        </ion-button>

        <ion-button expand="block" fill="clear" @click="router.push('/cadastro')">
          Não tem conta? Criar conta
        </ion-button>
      </div>
      <ion-toast :is-open="!!msg" :message="msg" :duration="3500" color="danger" @didDismiss="msg = ''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonSpinner, IonToast,
} from '@ionic/vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { signIn } = useAuth();

const email = ref('');
const senha = ref('');
const loading = ref(false);
const msg = ref('');
const erros = reactive({ email: '', senha: '' });

function validar(): boolean {
  erros.email = /^\S+@\S+\.\S+$/.test(email.value.trim()) ? '' : 'Informe um e-mail válido';
  erros.senha = senha.value ? '' : 'Informe a senha';
  return !erros.email && !erros.senha;
}

async function entrar() {
  if (!validar()) return;
  loading.value = true;
  try {
    await signIn(email.value.trim(), senha.value);
    router.replace('/app/dashboard');
  } catch (e) {
    msg.value = e instanceof Error && e.message.includes('Invalid login')
      ? 'E-mail ou senha incorretos'
      : e instanceof Error ? e.message : 'Erro ao entrar';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrap { max-width: 420px; margin: 0 auto; padding-top: 12vh; }
h1 { font-weight: 700; margin-bottom: 4px; }
.sub { color: var(--ion-color-medium); margin-top: 0; margin-bottom: 24px; }
.mt { margin-top: 16px; }
</style>
