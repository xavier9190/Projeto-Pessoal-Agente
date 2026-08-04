/**
 * Mapa de colorId do Google Calendar → cor hex.
 * Espelha categorias.py no backend.
 */
export const COLOR_MAP: Record<string, string> = {
  '9':  '#3b82f6', // Trabalho  — azul
  '10': '#22c55e', // Pessoal   — verde
  '11': '#ef4444', // Saúde     — vermelho
  '3':  '#8b5cf6', // Estudos   — roxo
  '6':  '#f97316', // Lazer     — laranja
}

export const COLOR_DEFAULT = '#6b7280' // cinza para eventos sem categoria
