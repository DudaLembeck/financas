import { computed, type ComputedRef, type Ref } from 'vue';

import type { Lancamento } from '@/types';

interface UseDashboard {
  totalReceitas: ComputedRef<number>;
  totalDespesas: ComputedRef<number>;
  saldo: ComputedRef<number>;
  quantidade: ComputedRef<number>;
  percentual: ComputedRef<number>;
  maiorCategoria: ComputedRef<{ nome: string; valor: number } | null>;
  pizzaSeries: ComputedRef<number[]>;
  pizzaLabels: ComputedRef<string[]>;
  barSeries: ComputedRef<{ name: string; data: number[] }[]>;
  barLabels: ComputedRef<string[]>;
}


const soma = (l: Lancamento[]) => l.reduce((t, x) => t + x.valor, 0);

export function useDashboard(receitas: Ref<Lancamento[]>, despesas: Ref<Lancamento[]>): UseDashboard {
  const totalReceitas = computed(() => soma(receitas.value));
  const totalDespesas = computed(() => soma(despesas.value));
  const saldo = computed(() => totalReceitas.value - totalDespesas.value);
  const quantidade = computed(() => receitas.value.length + despesas.value.length);
  const percentual = computed(() =>
    totalReceitas.value > 0 ? (totalDespesas.value / totalReceitas.value) * 100 : 0);

  const porCategoria = computed(() => {
    const mapa: Record<string, number> = {};
    despesas.value.forEach((d) => (mapa[d.categoria] = (mapa[d.categoria] ?? 0) + d.valor));
    return mapa;
  });
  const maiorCategoria = computed(() => {
    const e = Object.entries(porCategoria.value).sort((a, b) => b[1] - a[1])[0];
    return e ? { nome: e[0], valor: e[1] } : null;
  });

  const pizzaSeries = computed(() => Object.values(porCategoria.value));
  const pizzaLabels = computed(() => Object.keys(porCategoria.value));

  // agrupa por 'YYYY-MM' (slice evita bugs de fuso horário)
  const porMes = (l: Lancamento[]) => {
    const m: Record<string, number> = {};
    l.forEach((x) => { const k = x.data.slice(0, 7); m[k] = (m[k] ?? 0) + x.valor; });
    return m;
  };
  const meses = computed(() =>
    [...new Set([...receitas.value, ...despesas.value].map((x) => x.data.slice(0, 7)))].sort());
  const barLabels = computed(() => meses.value.map((m) => { const [a, mm] = m.split('-'); return `${mm}/${a}`; }));
  const barSeries = computed(() => {
    const r = porMes(receitas.value), d = porMes(despesas.value);
    return [
      { name: 'Receitas', data: meses.value.map((m) => r[m] ?? 0) },
      { name: 'Despesas', data: meses.value.map((m) => d[m] ?? 0) },
    ];
  });

  return { totalReceitas, totalDespesas, saldo, quantidade, percentual, maiorCategoria,
    pizzaSeries, pizzaLabels, barSeries, barLabels };
}