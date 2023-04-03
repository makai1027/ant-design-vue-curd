import type { PluginFunction } from "vue";
import Vue, { unref } from "vue";
import { isObject } from "@/utils/is";
import cloneDeep from "lodash-es/cloneDeep";

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: typeof Vue) => {
    // @ts-ignore
    app.component(comp.name || comp.displayName, component);
  };
  return component as T & PluginFunction<T>;
};

export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props as any).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  const res: any = cloneDeep(src);
  for (key in target) {
    if (isObject(res[key])) {
      res[key] = deepMerge(res[key], target[key]);
    } else {
      res[key] = target[key];
    }
  }
  return res;
}

export function useDesign(scope: string) {
  const values = {
    prefixCls: import.meta.env.VITE_APP_NAME,
  };
  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
