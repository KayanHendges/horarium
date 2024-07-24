export const getInitials = (value: string) => {
  const words = value.trim().split(" ")
  return words.map(w => w.substring(0, 1).toUpperCase()).join("")
}