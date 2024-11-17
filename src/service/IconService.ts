import type { IIcon } from '@/interfaces/common';
import icons from '../../public/data/icons.json';

export const IconService = {
  getIcons(): IIcon[] {
    return icons;
  },

  getIconById(iconId: string): IIcon | undefined {
    return icons.find((icon) => icon.id === iconId);
  }
};
