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
    h = (h * 60) % 360;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Function to convert HSL to hex
export function hslToHex(h: number, s: number, l: number): string {
  // Validate inputs
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return "#000000";
  }

  // Normalize values
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, s));
  const lightness = Math.max(0, Math.min(100, l));

  const s_normalized = saturation / 100;
  const l_normalized = lightness / 100;

  const c = (1 - Math.abs(2 * l_normalized - 1)) * s_normalized;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l_normalized - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= hue && hue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= hue && hue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= hue && hue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= hue && hue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= hue && hue < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= hue && hue < 360) {
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

// Function to convert hex to HSL string
export function hexToHslString(hex: string): string {
  const hsl = hexToHsl(hex);
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

// Function to convert HSL string to hex
export function hslStringToHex(hslString: string): string {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return "#000000";

  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);

  return hslToHex(h, s, l);
}

// Function to convert hex to OKLCH
export function hexToOklch(hex: string): { l: number; c: number; h: number } {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Convert RGB to OKLCH using a more accurate algorithm
  // First convert to linear RGB
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = linearR * 0.4124 + linearG * 0.3576 + linearB * 0.1805;
  const y = linearR * 0.2126 + linearG * 0.7152 + linearB * 0.0722;
  const z = linearR * 0.0193 + linearG * 0.1192 + linearB * 0.9505;

  // Convert to OKLab (simplified OKLCH)
  const l = 0.116 * Math.pow(y, 1 / 3) + 0.5;
  const a = 0.5 * (Math.pow(x, 1 / 3) - Math.pow(z, 1 / 3));
  const b_val =
    0.2 * (Math.pow(x, 1 / 3) + Math.pow(z, 1 / 3) - 2 * Math.pow(y, 1 / 3));

  // Convert to OKLCH
  const c = Math.sqrt(a * a + b_val * b_val);
  let h = (Math.atan2(b_val, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return {
    l: Math.round(l * 100),
    c: Math.round(c * 100),
    h: Math.round(h),
  };
}

// Function to convert OKLCH to hex
export function oklchToHex(l: number, c: number, h: number): string {
  // Validate inputs
  if (isNaN(l) || isNaN(c) || isNaN(h)) {
    return "#000000";
  }

  // Convert from OKLCH to OKLab
  const lightness = l / 100;
  const chroma = c / 100;
  const hue = (h * Math.PI) / 180; // Convert to radians

  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);

  // Convert OKLab to XYZ (simplified)
  const x = Math.pow(lightness + a * 0.577 + b * 0.408, 3);
  const y = Math.pow(lightness + a * 0.577 - b * 0.408, 3);
  const z = Math.pow(lightness - a * 1.154, 3);

  // Convert XYZ to linear RGB
  const linearR = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const linearG = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const linearB = x * 0.0557 + y * -0.204 + z * 1.057;

  // Convert linear RGB to sRGB
  const r =
    linearR <= 0.0031308
      ? 12.92 * linearR
      : 1.055 * Math.pow(linearR, 1 / 2.4) - 0.055;
  const g =
    linearG <= 0.0031308
      ? 12.92 * linearG
      : 1.055 * Math.pow(linearG, 1 / 2.4) - 0.055;
  const b_val =
    linearB <= 0.0031308
      ? 12.92 * linearB
      : 1.055 * Math.pow(linearB, 1 / 2.4) - 0.055;

  // Clamp values and convert to hex
  const rHex = Math.round(Math.max(0, Math.min(1, r)) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round(Math.max(0, Math.min(1, g)) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round(Math.max(0, Math.min(1, b_val)) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

// Function to convert hex to OKLCH string
export function hexToOklchString(hex: string): string {
  const oklch = hexToOklch(hex);
  return `oklch(${oklch.l}% ${oklch.c}% ${oklch.h})`;
}

// Function to convert OKLCH string to hex
export function oklchStringToHex(oklchString: string): string {
  const match = oklchString.match(/oklch\((\d+)%\s+(\d+)%\s+(\d+)\)/);
  if (!match) return "#000000";

  const l = parseInt(match[1]);
  const c = parseInt(match[2]);
  const h = parseInt(match[3]);

  return oklchToHex(l, c, h);
}

// Function to format color based on format type
export function formatColor(
  color: string,
  format: "hex" | "hsl" | "oklch"
): string {
  if (!isValidHexColor(color)) return color;

  switch (format) {
    case "hex":
      return color;
    case "hsl":
      return hexToHslString(color);
    case "oklch":
      return hexToOklchString(color);
    default:
      return color;
  }
}

// Function to parse color string and convert to hex
export function parseColorString(colorString: string): string {
  // Trim whitespace
  const trimmed = colorString.trim();

  // Check if it's a valid hex color
  if (isValidHexColor(trimmed)) {
    return trimmed;
  }

  // Check if it's a valid HSL string
  if (trimmed.startsWith("hsl(") && trimmed.endsWith(")")) {
    const hslMatch = trimmed.match(
      /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/
    );
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]);
      const l = parseInt(hslMatch[3]);

      // Validate HSL values
      if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        return hslToHex(h, s, l);
      }
    }
  }

  // Check if it's a valid OKLCH string
  if (trimmed.startsWith("oklch(") && trimmed.endsWith(")")) {
    const oklchMatch = trimmed.match(/oklch\(\s*(\d+)%\s+(\d+)%\s+(\d+)\s*\)/);
    if (oklchMatch) {
      const l = parseInt(oklchMatch[1]);
      const c = parseInt(oklchMatch[2]);
      const h = parseInt(oklchMatch[3]);

      // Validate OKLCH values
      if (l >= 0 && l <= 100 && c >= 0 && c <= 100 && h >= 0 && h <= 360) {
        return oklchToHex(l, c, h);
      }
    }
  }

  // If no valid format is found, return the original string
  return colorString;
}

// Function to generate color palette similar to the image
export function generateColorPalette(
  primaryColor: string
): { color: string; shade: string }[] {
  const hsl = hexToHsl(primaryColor);
  const palette: { color: string; shade: string }[] = [];

  // Generate 10 shades from 50 to 900 (like Tailwind CSS)
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  shades.forEach((shade) => {
    let lightness: number;
    let saturation: number;

    if (shade <= 500) {
      // Lighter shades: 50-500
      const factor = shade / 500;
      lightness = 95 - factor * 45; // 95% to 50%
      saturation = Math.max(hsl.s * (0.5 + factor * 0.5), 10); // Adjust saturation for lighter shades
    } else {
      // Darker shades: 600-900
      const factor = (shade - 500) / 400;
      lightness = 50 - factor * 40; // 50% to 10%
      saturation = Math.min(hsl.s * (1 + factor * 0.2), 100); // Increase saturation for darker shades
    }

    const color = hslToHex(hsl.h, saturation, lightness);
    palette.push({ color, shade: shade.toString() });
  });

  return palette;
}

// Function to validate hex color
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Function to validate if a string is a valid but incomplete HSL format
export function isValidIncompleteHsl(colorString: string): boolean {
  const trimmed = colorString.trim();

  // Check if it starts with hsl( and has some content
  if (!trimmed.startsWith("hsl(") || !trimmed.includes(")")) {
    return false;
  }

  // Check if it has the basic structure
  const content = trimmed.slice(4, -1); // Remove hsl( and )
  const parts = content.split(",");

  // Should have 3 parts
  if (parts.length !== 3) {
    return false;
  }

  // Check if each part is a valid number or percentage
  const hPart = parts[0].trim();
  const sPart = parts[1].trim();
  const lPart = parts[2].trim();

  // Hue should be a number
  const h = parseInt(hPart);
  if (isNaN(h) || h < 0 || h > 360) {
    return false;
  }

  // Saturation should be a percentage
  if (!sPart.endsWith("%")) {
    return false;
  }
  const s = parseInt(sPart.slice(0, -1));
  if (isNaN(s) || s < 0 || s > 100) {
    return false;
  }

  // Lightness should be a percentage
  if (!lPart.endsWith("%")) {
    return false;
  }
  const l = parseInt(lPart.slice(0, -1));
  if (isNaN(l) || l < 0 || l > 100) {
    return false;
  }

  return true;
}

// Function to validate if a string is a valid but incomplete OKLCH format
export function isValidIncompleteOklch(colorString: string): boolean {
  const trimmed = colorString.trim();

  // Check if it starts with oklch( and has some content
  if (!trimmed.startsWith("oklch(") || !trimmed.includes(")")) {
    return false;
  }

  // Check if it has the basic structure
  const content = trimmed.slice(6, -1); // Remove oklch( and )
  const parts = content.split(/\s+/);

  // Should have 3 parts
  if (parts.length !== 3) {
    return false;
  }

  // Check if each part is a valid number or percentage
  const lPart = parts[0].trim();
  const cPart = parts[1].trim();
  const hPart = parts[2].trim();

  // Lightness should be a percentage
  if (!lPart.endsWith("%")) {
    return false;
  }
  const l = parseInt(lPart.slice(0, -1));
  if (isNaN(l) || l < 0 || l > 100) {
    return false;
  }

  // Chroma should be a percentage
  if (!cPart.endsWith("%")) {
    return false;
  }
  const c = parseInt(cPart.slice(0, -1));
  if (isNaN(c) || c < 0 || c > 100) {
    return false;
  }

  // Hue should be a number
  const h = parseInt(hPart);
  if (isNaN(h) || h < 0 || h > 360) {
    return false;
  }

  return true;
}
