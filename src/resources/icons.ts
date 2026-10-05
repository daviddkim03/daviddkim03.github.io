import { GenIcon, type IconType } from "react-icons";
import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu";

const HyberTecIcon: IconType = GenIcon({
  tag: "svg",
  attr: { viewBox: "0 0 126 192", fill: "currentColor" },
  child: [
    {
      tag: "path",
      attr: {
        d: "M 53.736 13.764 L 41 26.528 41 49.264 L 41 72 34.500 72 L 28 72 28 57 C 28 48.750, 27.643 42, 27.207 42 C 25.943 42, 1.319 64.727, 0.626 66.533 C -0.280 68.894, -0.146 143, 0.764 143 C 1.185 143, 7.293 137.223, 14.338 130.162 L 27.148 117.324 26.824 106.912 L 26.500 96.500 34.250 96.208 L 42 95.916 42 143.458 C 42 169.606, 42.287 191, 42.638 191 C 43.415 191, 49.895 185.194, 60.250 175.219 L 68 167.754 68 131.377 L 68 95 71.484 95 L 74.968 95 75.234 122.515 L 75.500 150.029 88.750 139.326 L 102 128.623 102 111.811 L 102 95 113.982 95 L 125.964 95 126.251 118.750 C 126.409 131.813, 126.570 125.175, 126.609 104 C 126.648 82.825, 126.498 66.963, 126.277 68.750 L 125.873 72 96.937 72 L 68 72 68 36.500 C 68 16.975, 67.656 1, 67.236 1 C 66.815 1, 60.740 6.744, 53.736 13.764",
      },
      child: [],
    },
  ],
});

/**
 * Icons that content/config refer to by name (e.g. `social` links). UI code
 * imports Lucide icons from `react-icons/lu` directly.
 */
export const iconLibrary = {
  hybertec: HyberTecIcon,
  github: LuGithub,
  linkedin: LuLinkedin,
  email: LuMail,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof iconLibrary;
