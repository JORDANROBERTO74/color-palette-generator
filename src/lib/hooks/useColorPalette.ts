import { useState, useEffect, useCallback, useMemo } from "react";
import {
  generateColorPalette,
  isValidHexColor,
  formatColor,
} from "../colorUtils";
import { useToast } from "@/hooks/use-toast";

type ColorFormat = "hex" | "hsl" | "oklch";

interface UseColorPaletteReturn {
  primaryColor: string;
  palette: { color: string; shade: string }[];
  copiedColor: string | null;
  focusedIndex: number;
  colorFormat: ColorFormat;
  formattedColor: string;
  setPrimaryColor: (color: string) => void;
  setColorFormat: (format: ColorFormat) => void;
  copyToClipboard: (color: string) => Promise<void>;
  generateRandomColor: () => void;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent, color: string) => void;
  handlePaletteKeyDown: (event: React.KeyboardEvent) => void;
}

export function useColorPalette(
  initialColor: string = "#808080"
): UseColorPaletteReturn {
  const [primaryColor, setPrimaryColor] = useState(initialColor);
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");
  const [palette, setPalette] = useState<{ color: string; shade: string }[]>(
    []
  );
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const { toast } = useToast();

  // Memoize formatted color
  const formattedColor = useMemo(() => {
    return formatColor(primaryColor, colorFormat);
  }, [primaryColor, colorFormat]);

  // Memoize palette generation to avoid unnecessary recalculations
  const generatedPalette = useMemo(() => {
    if (isValidHexColor(primaryColor)) {
      return generateColorPalette(primaryColor);
    }
    return [];
  }, [primaryColor]);

  // Update palette immediately when primaryColor changes
  useEffect(() => {
    // Update palette immediately without loading delay
    setPalette(generatedPalette);
  }, [generatedPalette]);

  const copyToClipboard = useCallback(
    async (color: string) => {
      try {
        await navigator.clipboard.writeText(color);
        setCopiedColor(color);

        // Show success toast
        toast({
          title: "Color copied",
          description: `${color} copied to clipboard`,
          duration: 2000,
        });

        setTimeout(() => setCopiedColor(null), 2000);
      } catch (err) {
        console.error("Failed to copy color:", err);

        // Show error toast
        toast({
          title: "Copy failed",
          description: "Could not copy color to clipboard",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
    [toast]
  );

  const generateRandomColor = useCallback(() => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setPrimaryColor(randomColor);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, color: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        copyToClipboard(color);
      }
    },
    [copyToClipboard]
  );

  const handlePaletteKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const paletteLength = palette.length;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          setFocusedIndex((prev) => (prev < paletteLength - 1 ? prev + 1 : 0));
          break;
        case "ArrowLeft":
          event.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : paletteLength - 1));
          break;
        case "Home":
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          event.preventDefault();
          setFocusedIndex(paletteLength - 1);
          break;
      }
    },
    [palette.length]
  );

  return {
    primaryColor,
    palette,
    copiedColor,
    focusedIndex,
    colorFormat,
    formattedColor,
    setPrimaryColor,
    setColorFormat,
    copyToClipboard,
    generateRandomColor,
    setFocusedIndex,
    handleKeyDown,
    handlePaletteKeyDown,
  };
}
