
type SizeClass = 'h' | 'v' | 't' | 'l' | 'b' | 'r'
const sized = (attr: string, value: number, size?: SizeClass) => {
  switch (size) {
    case "h": return `${attr}-left: ${value}px; ${attr}-right: ${value}px;`
    case "v": return `${attr}-top: ${value}px; ${attr}-bottom: ${value}px;`
    case "t": return `${attr}-top: ${value}px;`
    case "l": return `${attr}-left: ${value}px;`
    case "b": return `${attr}-bottom: ${value}px;`
    case "r": return `${attr}-right: ${value}px;`
    default: return `${attr}: ${value}px;`
  }
}

export const padding = (size: number, sizeClass?: SizeClass) => sized('padding', size * 5, sizeClass)
export const margin = (size: number, sizeClass?: SizeClass) => sized('margin', size * 5, sizeClass)
