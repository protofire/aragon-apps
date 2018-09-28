import JsonSchemaValidator from 'ajv'

const validator = new JsonSchemaValidator({
  logger: console
})

validator.addFormat('address', {
  type: 'string',
  validate: value => {
    // TODO: web3.utils.isAddress(address)
    return value
  }
})

export default validator
