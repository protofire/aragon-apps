//
// Mock data
//

const allocation = [
  {
    token: 'ETH',
    'distribution': 13
  },
  {
    token: 'ANT',
    'distribution': 33
  },
  {
    token: 'SNT',
    'distribution': 12
  },
  {
    token: 'WOW',
    'distribution': 42
  }
]

export function getSalaryAllocation () {
  return allocation.sort((a, b) => b.distribution - a.distribution)
}
