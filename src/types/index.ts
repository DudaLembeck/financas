export type Tipo = 'receitas' | 'despesas';

export interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string; // YYYY-MM-DD
  user_id: string;
}

export type LancamentoInput = Omit<Lancamento, 'id' | 'user_id'>;

export const CATEGORIAS: Record<Tipo, string[]> = {
  receitas: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  despesas: ['Alimentação', 'Transporte', 'Moradia', 'Educação', 'Lazer', 'Saúde', 'Outros'],
};
