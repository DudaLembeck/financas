export const brl = (v: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export const pad = (n: number): string => String(n).padStart(2, '0');

export const toISODate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const hoje = (): string => toISODate(new Date());

export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const mesLabel = (key: string): string => `${key.slice(5, 7)}/${key.slice(0, 4)}`;
