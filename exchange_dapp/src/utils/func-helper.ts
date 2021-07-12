export const isEmpty = (objectToCheck : any) :any => {
   return objectToCheck &&  Object.entries(objectToCheck).length === 0 && objectToCheck.constructor === Object
}