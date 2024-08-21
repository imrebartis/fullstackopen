export const cleanGenre = (genre) => {
  let cleaned = genre.trim()
  cleaned = cleaned.replace(/^['"](.+?)['"]$/, '$1') // Remove surrounding quotes
  cleaned = cleaned.replace(/['"]/g, '') // Remove any remaining quotes within the string
  return cleaned.toLowerCase()
}
