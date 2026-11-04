/** "Inés, Agustín y Carla" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

/** Tiempo de lectura cómodo para una frase, en milisegundos. */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return 2400 + words * 280
}
