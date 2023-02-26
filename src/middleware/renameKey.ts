export function renameKey(obj: any, oldKey: string, newKey: string){
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
    return obj;
}