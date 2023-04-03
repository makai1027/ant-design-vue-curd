import { Button } from "ant-design-vue/types/button/button";
import { Tooltip } from "ant-design-vue/types/tootip/tooltip";
import { RoleEnum } from "@/enums/roleEnum";

import { Fn } from "#/index";
export interface ActionItem extends Button {
  onClick?: Fn;
  label?: string;
  color?: "success" | "error" | "warning";
  icon: string;
  popConfirm?: PopConfirm;
  disabled: boolean;
  divider: boolean;
  // 权限编码控制是否显示
  auth?: RoleEnum | RoleEnum[] | string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | Tooltip;
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom"
    | "bottomLeft"
    | "bottomRight";
}
