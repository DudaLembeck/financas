<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Receitas e despesas por mês</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p v-if="meses.length === 0" class="vazio">Sem lançamentos no período.</p>
      <VueApexCharts v-else :key="chartKey" type="bar" height="300" :options="options" :series="series" />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { brl, mesLabel } from '@/utils/format';

const props = defineProps<{
  receitas: Record<string, number>; // chave YYYY-MM
  despesas: Record<string, number>;
  dark: boolean;
}>();

const meses = computed(() =>
  Array.from(new Set([...Object.keys(props.receitas), ...Object.keys(props.despesas)])).sort(),
);

const series = computed(() => [
  { name: 'Receitas', data: meses.value.map((m) => props.receitas[m] ?? 0) },
  { name: 'Despesas', data: meses.value.map((m) => props.despesas[m] ?? 0) },
]);

const chartKey = computed(() => `${props.dark}-${meses.value.join('|')}-${JSON.stringify(series.value)}`);

const options = computed<ApexOptions>(() => ({
  chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, fontFamily: 'inherit' },
  theme: { mode: props.dark ? 'dark' : 'light' },
  colors: ['#2dd36f', '#eb445a'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
  dataLabels: { enabled: false },
  xaxis: { categories: meses.value.map(mesLabel) },
  yaxis: { labels: { formatter: (v: number) => brl(v) } },
  tooltip: { y: { formatter: (v: number) => brl(v) } },
  legend: { position: 'bottom' },
}));
</script>

<style scoped>
.vazio { text-align: center; color: var(--ion-color-medium); }
</style>
