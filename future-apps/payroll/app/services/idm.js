const roles = {
  SENIOR_BARISTA: 'Senior Barista',
  SENIOR_DEVELOPER: 'Senior Developer'
}

export const entities = [
  {
    domain: 'ivanka.trump.eth',
    name: 'Ivanka Trump',
    role: roles.SENIOR_BARISTA,
    accountAddress: '0xf29bf836c16891c85cc5e973d49909ba54d714d4'
  },
  {
    domain: 'protofire.aragonid.eth',
    name: 'ProtoFire',
    accountAddress: '0xcafe1a77e84698c83ca8931f54a755176ef75f2c'
  },
  {
    domain: 'sistemico.protofire.eth',
    name: 'Sebastián Galiano',
    accountAddress: '0x2d7a7d0adf9c5f9073fefbdc18188bd23c68b633',
    role: roles.SENIOR_DEVELOPER
  }
]

export async function getIdentity (search, limit = 5) {
  const criteria = new RegExp(search, 'i')

  const matches = entities.filter(entity =>
    criteria.test(entity.domain) ||
    criteria.test(entity.name) ||
    criteria.test(entity.role)
  )

  return matches.slice(0, limit)
}

export async function getRoles () {
  return roles
}
