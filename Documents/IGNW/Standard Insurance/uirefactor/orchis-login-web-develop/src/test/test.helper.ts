export function createSpyObjFromClass(classInstance: any) {
  return jasmine.createSpyObj(classInstance.constructor.name, [...Object.getOwnPropertyNames(classInstance.prototype)]);
}
