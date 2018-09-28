import JsonSchemaValidator from 'ajv'
import utils from 'web3-utils'

const validator = new JsonSchemaValidator({
  logger: console
})

validator.addFormat('address', {
  type: 'string',
  validate: utils.isAddress
})

export default validator
