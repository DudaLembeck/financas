<template>
  <div class="grid">
    <ion-card class="c success">
      <ion-card-content>
        <small>Total de receitas</small>
        <strong>{{ brl(receitas) }}</strong>
      </ion-card-content>
    </ion-card>
    <ion-card class="c danger">
      <ion-card-content>
        <small>Total de despesas</small>
        <strong>{{ brl(despesas) }}</strong>
      </ion-card-content>
    </ion-card>
    <ion-card class="c full" :class="receitas - despesas >= 0 ? 'success' : 'danger'">
      <ion-card-content>
        <small>Saldo atual</small>
        <strong class="big">{{ brl(receitas - despesas) }}</strong>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent } from '@ionic/vue';
import { brl } from '@/utils/format';

defineProps<{ receitas: number; despesas: number }>();
</script>

<style scoped>
.grid { display: grid; grid-template-columns: 1fr 1fr; }
.full { grid-column: 1 / -1; }
.c { margin: 8px; }
.c ion-card-content { display: flex; flex-direction: column; gap: 4px; }
.c small { color: var(--ion-color-medium); }
.c strong { font-size: 1.15rem; }
.c .big { font-size: 1.5rem; }
.success strong { color: var(--ion-color-success); }
.danger strong { color: var(--ion-color-danger); }
</style>
