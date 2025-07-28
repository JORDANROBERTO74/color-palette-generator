// Function to convert hex to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Function to convert HSL to hex
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

// Function to generate color palette
export function generateColorPalette(primaryColor: string): string[] {
  const hsl = hexToHsl(primaryColor);
  const palette: string[] = [];

  // Primary color
  palette.push(primaryColor);

  // Lightness variations
  const variations = [20, 40, 60, 80, 90, 95];
  variations.forEach((l) => {
    palette.push(hslToHex(hsl.h, hsl.s, l));
  });

  // Complementary colors
  const complementaryHue = (hsl.h + 180) % 360;
  palette.push(hslToHex(complementaryHue, hsl.s, hsl.l));

  // Analogous colors
  const analogous1 = (hsl.h + 30) % 360;
  const analogous2 = (hsl.h - 30 + 360) % 360;
  palette.push(hslToHex(analogous1, hsl.s, hsl.l));
  palette.push(hslToHex(analogous2, hsl.s, hsl.l));

  // Triadic colors
  const triadic1 = (hsl.h + 120) % 360;
  const triadic2 = (hsl.h + 240) % 360;
  palette.push(hslToHex(triadic1, hsl.s, hsl.l));
  palette.push(hslToHex(triadic2, hsl.s, hsl.l));

  return palette;
}

// Function to validate hex color
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}
