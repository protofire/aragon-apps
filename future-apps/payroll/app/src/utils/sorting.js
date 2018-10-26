export const SORT_DIRECTION = {
  ASC: 1,
  DESC: -1
}

export function sort (items, sortValue, direction) {
  if (!Array.isArray(items) || items.length < 2) {
    return items
  }

  const values = items.map((item, index) => [index, sortValue(item)])

  values.sort(([, a], [, b]) => {
    if (a === b) return 0
    if (a < b) return -direction
    if (a == null) return 1
    if (b == null) return -1

    return direction
  })

  return values.map(([index]) => items[index])
}
