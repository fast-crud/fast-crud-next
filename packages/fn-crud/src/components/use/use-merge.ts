import { isArray, cloneDeepWith, mergeWith } from "lodash-es";
import { isRef, isShallow, toRaw } from "vue";
import { isFnComputeValue } from "../../crud/use/use-compute";
function isUnMergeable(srcValue: any) {
  return srcValue != null && (srcValue instanceof UnMergeable || isRef(srcValue) || isShallow(srcValue) || isFnComputeValue(srcValue));
}
function isUnCloneable(value: any) {
  return isUnMergeable(value) && !value.__cloneable;
}

function isComponentName(key: unknown, value: any): boolean {
  return key === "name" && value != null && typeof value === "object" &&
    (typeof value.setup === "function" || typeof value.render === "function" || typeof value.template === "string" || "__vccOpts" in value);
}

export function merge(target: any, ...sources: any[]) {
  /**
   * 如果目标为不可合并对象，比如array、unMergeable、ref,则直接覆盖不合并
   * @param objValue 被合并对象
   * @param srcValue 来源对象
   */
  function customizer(objValue: any, srcValue: any, key: string, _target: object, source: Record<string, any>) {
    const rawValue = toRaw(source)[key];
    if (isRef(rawValue)) return rawValue;
    if (srcValue == null) {
      return;
    }
    if (isComponentName(key, srcValue)) return toRaw(srcValue);
    if (isUnMergeable(srcValue)) return srcValue;
    if (isFnComputeValue(objValue) || isRef(objValue)) return cloneDeep(srcValue);
    // 如果被合并对象为数组，则直接被覆盖对象覆盖，只要覆盖对象不为空
    if (isArray(objValue)) {
      //原对象如果是数组
      return srcValue; //来源对象
    }
  }

  let found: any = null;
  for (const item of sources) {
    if (isUnMergeable(item)) {
      found = item;
    }
  }
  if (found) {
    return found;
  }
  const sourceSnapshots = sources.map((source: any) => source === target ? cloneDeep(source) : source);
  return mergeWith(target, ...sourceSnapshots, customizer);
}

function cloneDeep(target: any) {
  if (isUnCloneable(target)) {
    return target;
  }
  function customizer(value: any, key: unknown) {
    if (isComponentName(key, value)) return toRaw(value);
    if (isUnCloneable(value)) {
      return value;
    }
  }

  return cloneDeepWith(target, customizer);
}
export class UnMergeable {
  __cloneable = false;

  setCloneable(cloneable: any) {
    this.__cloneable = cloneable;
  }
}

export function useMerge() {
  return {
    merge,
    cloneDeep,
    UnMergeable
  };
}
