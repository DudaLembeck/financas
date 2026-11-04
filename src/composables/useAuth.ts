import type { User } from '@supabase/supabase-js';
import { ref, readonly } from 'vue';


import { supabase } from '@/lib/supabase';

const user = ref<User | null>(null);
let initPromise: Promise<void> | null = null;

export function initAuth(): Promise<void> {
  if (!initPromise) {
    initPromise = supabase.auth.getSession().then(({ data }) => {
      user.value = data.session?.user ?? null;
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null;
      });
    });
  }
  return initPromise;
}

export function useAuth(): any {
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  /** Retorna true se já ficou logado; false se precisa confirmar o e-mail. */
  async function signUp(nome: string, email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });
    if (error) throw error;
    return !!data.session;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return { user: readonly(user), signIn, signUp, signOut };
}
