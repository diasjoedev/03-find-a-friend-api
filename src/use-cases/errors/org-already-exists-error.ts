export class OrgAlreadyExistsError extends Error {
    constructor() {
      super('Org E-mail already exists')
    }
  }
  