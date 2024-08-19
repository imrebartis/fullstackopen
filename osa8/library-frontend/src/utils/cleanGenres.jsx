export const cleanGenre = (genre) => {
  let cleaned = genre.trim()
  cleaned = cleaned.replace(/^["'](.+(?=["']$))["']$/, '$1')
  return cleaned.toLowerCase()
}
