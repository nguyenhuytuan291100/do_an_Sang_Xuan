import type { MenuProps } from "antd";
import { Image } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    key: "1",
    icon: <img src="assets/images/business-report.png" width="25" alt="" />,
    label: "Option 1",
  },
  { key: "2", icon: <div />, label: "Option 2" },
  { key: "3", icon: <div />, label: "Option 3" },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <div />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <div />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "11", label: "Option 11" },
          { key: "12", label: "Option 12" },
        ],
      },
    ],
  },
];

export { menuItems };
