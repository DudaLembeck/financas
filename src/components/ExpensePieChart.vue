<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Despesas por categoria</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p v-if="series.length === 0" class="vazio">Sem despesas no período.</p>
      <VueApexCharts v-else :key="chartKey" type="pie" height="300" :options="options" :series="series" />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { brl } from '@/utils/format';

const props = defineProps<{ dados: Record<string, number>; dark: boolean }>();

const labels = computed(() => Object.keys(props.dados));
const series = computed(() => Object.values(props.dados));
const chartKey = computed(() => `${props.dark}-${labels.value.join('|')}-${series.value.join('|')}`);

const options = computed<ApexOptions>(() => ({
  chart: { type: 'pie', background: 'transparent', fontFamily: 'inherit' },
  theme: { mode: props.dark ? 'dark' : 'light' },
  labels: labels.value,
  legend: { position: 'bottom' },
  dataLabels: { formatter: (v: number) => `${v.toFixed(0)}%` },
  tooltip: { y: { formatter: (v: number) => brl(v) } },
  stroke: { colors: [props.dark ? '#1e1e1e' : '#fff'] },
}));
</script>

<style scoped>
.vazio { text-align: center; color: var(--ion-color-medium); }
</style>
