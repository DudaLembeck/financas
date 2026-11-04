<template>
  <ion-page>
    <ion-content class="ion-padding ion-text-center">
      <ion-spinner class="ion-margin-top" />
      <p>Saindo...</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonSpinner, onIonViewDidEnter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { logout } = useAuth();

onIonViewDidEnter(async () => {
  await logout();
  router.replace('/login');
});
</script>