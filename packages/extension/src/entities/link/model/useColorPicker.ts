import { reactive } from 'vue';
import type { ColorPicker } from './types';

export function useColorPicker() {
  const colorPicker = reactive<ColorPicker>({
    iteration: -1,
    colors: [
      "#ff0000", "#ffc107", "#28a745", "#007bff", "#0000ff", "#8B008B", "#006400", "#DAA520",
      "#dc3545", "#343a40", "#800000", "#00008B", "#778899", "#FF1493", "#FF0000"
    ],
    getColor() {
      if (this.iteration - 1 > this.colors.length) {
        this.iteration = 0;
      } else {
        this.iteration++;
      }
      return this.colors[this.iteration++];
    }
  });

  const getNextColor = (): string => {
    return colorPicker.getColor();
  };

  return {
    colorPicker,
    getNextColor
  };
}