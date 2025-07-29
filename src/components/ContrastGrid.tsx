"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Check, AlertTriangle } from "lucide-react";
import { useState, useMemo, useCallback } from "react";

interface ContrastGridProps {
  isOpen: boolean;
  onClose: () => void;
  palette: { color: string; shade: string }[];
  primaryColor: string;
}

// Function to determine the best text color (black or white) for a background
function getBestTextColor(
  backgroundColor: string,
  guideline: string = "WCAG 2"
): string {
  if (guideline === "WCAG 3 (APCA)") {
    // Use APCA contrast calculation
    const blackContrast = Math.abs(
      getAPCAContrastRatio(backgroundColor, "#000000")
    );
    const whiteContrast = Math.abs(
      getAPCAContrastRatio(backgroundColor, "#ffffff")
    );

    // Return the color that provides better contrast
    return blackContrast > whiteContrast ? "#000000" : "#ffffff";
  } else {
    // Use WCAG 2 contrast calculation
    const blackContrast = getWCAG2ContrastRatio(backgroundColor, "#000000");
    const whiteContrast = getWCAG2ContrastRatio(backgroundColor, "#ffffff");

    // Return the color that provides better contrast
    return blackContrast > whiteContrast ? "#000000" : "#ffffff";
  }
}

// Function to calculate relative luminance
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Function to calculate APCA contrast ratio (improved implementation)
function getAPCAContrastRatio(bgColor: string, textColor: string): number {
  const bgLum = getLuminance(bgColor);
  const textLum = getLuminance(textColor);

  // APCA contrast calculation (improved)
  // Formula: |L1 - L2| / max(L1, L2) * 100 * sign
  const contrast = Math.abs(bgLum - textLum) / Math.max(bgLum, textLum);
  const sign = bgLum > textLum ? 1 : -1;

  // Scale to APCA range (-108 to +108)
  return Math.round(contrast * 100 * sign);
}

// Function to calculate WCAG 2 contrast ratio
function getWCAG2ContrastRatio(bgColor: string, textColor: string): number {
  const bgLum = getLuminance(bgColor);
  const textLum = getLuminance(textColor);

  const brightest = Math.max(bgLum, textLum);
  const darkest = Math.min(bgLum, textLum);

  return Math.round(((brightest + 0.05) / (darkest + 0.05)) * 10) / 10;
}

export default function ContrastGrid({
  isOpen,
  onClose,
  palette,
  primaryColor,
}: ContrastGridProps) {
  const [selectedGuideline, setSelectedGuideline] = useState("WCAG 3 (APCA)");
  const [selectedFilter, setSelectedFilter] = useState("45+");

  // Create color array with white and black
  const allColors = useMemo(
    () => [
      { color: "#ffffff", shade: "White" },
      ...palette,
      { color: "#000000", shade: "Black" },
    ],
    [palette]
  );

  // Memoized contrast calculations for performance
  const contrastCache = useMemo(() => {
    const cache = new Map<string, number>();
    allColors.forEach((bg) => {
      allColors.forEach((text) => {
        const key = `${bg.color}-${text.color}`;
        const contrast =
          selectedGuideline === "WCAG 3 (APCA)"
            ? getAPCAContrastRatio(bg.color, text.color)
            : getWCAG2ContrastRatio(bg.color, text.color);
        cache.set(key, contrast);
      });
    });
    return cache;
  }, [allColors, selectedGuideline]);

  const filterOptions = [
    { value: "15+", label: "15+", description: "Minimum for large text" },
    { value: "30+", label: "30+", description: "Minimum for normal text" },
    {
      value: "45+",
      label: "45+",
      description: "Minimum for headings and titles",
    },
    { value: "60+", label: "60+", description: "Good contrast" },
    { value: "75+", label: "75+", description: "Excellent contrast" },
    { value: "All", label: "All", description: "Show all combinations" },
  ];

  const guidelineOptions = [
    { value: "WCAG 3 (APCA)", label: "WCAG 3 (APCA)" },
    { value: "WCAG 2", label: "WCAG 2" },
  ];

  const getContrastForCombination = useCallback(
    (bgColor: string, textColor: string) => {
      const key = `${bgColor}-${textColor}`;
      return contrastCache.get(key) || 0;
    },
    [contrastCache]
  );

  const shouldShowCell = useCallback(
    (contrast: number) => {
      if (selectedFilter === "All") return true;
      const minContrast = parseInt(selectedFilter);
      return selectedGuideline === "WCAG 3 (APCA)"
        ? Math.abs(contrast) >= minContrast
        : contrast >= minContrast;
    },
    [selectedFilter, selectedGuideline]
  );

  const getContrastDisplayValue = useCallback(
    (contrast: number) => {
      if (selectedGuideline === "WCAG 3 (APCA)") {
        return contrast;
      } else {
        return contrast.toFixed(1);
      }
    },
    [selectedGuideline]
  );

  const getContrastLabel = useCallback(() => {
    return selectedGuideline === "WCAG 3 (APCA)"
      ? "APCA Contrast"
      : "WCAG 2 Ratio";
  }, [selectedGuideline]);

  const getContrastRating = useCallback(
    (contrast: number) => {
      if (selectedGuideline === "WCAG 3 (APCA)") {
        const absContrast = Math.abs(contrast);
        if (absContrast >= 75) {
          return {
            rating: "Excellent",
            color: "text-green-600",
            icon: <Check className="w-4 h-4 text-green-600" />,
          };
        } else if (absContrast >= 60) {
          return {
            rating: "Good",
            color: "text-blue-600",
            icon: <Check className="w-4 h-4 text-blue-600" />,
          };
        } else if (absContrast >= 45) {
          return {
            rating: "Acceptable",
            color: "text-yellow-600",
            icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
          };
        } else {
          return {
            rating: "Poor",
            color: "text-red-600",
            icon: <X className="w-4 h-4 text-red-600" />,
          };
        }
      } else {
        if (contrast >= 7) {
          return {
            rating: "AAA",
            color: "text-green-600",
            icon: <Check className="w-4 h-4 text-green-600" />,
          };
        } else if (contrast >= 4.5) {
          return {
            rating: "AA",
            color: "text-blue-600",
            icon: <Check className="w-4 h-4 text-blue-600" />,
          };
        } else if (contrast >= 3) {
          return {
            rating: "A",
            color: "text-yellow-600",
            icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
          };
        } else {
          return {
            rating: "Fail",
            color: "text-red-600",
            icon: <X className="w-4 h-4 text-red-600" />,
          };
        }
      }
    },
    [selectedGuideline]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0 dialog-content">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span>Contrast grid ({getColorName(primaryColor)})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-6 space-y-6">
            {/* Guidelines */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                GUIDELINES
              </h3>
              <div className="space-y-1">
                {guidelineOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedGuideline(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm rounded ${
                      selectedGuideline === option.value
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                FILTER
              </h3>
              <div className="space-y-1">
                {filterOptions.map((option) => (
                  <div key={option.value}>
                    <button
                      onClick={() => setSelectedFilter(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm rounded ${
                        selectedFilter === option.value
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                    {selectedFilter === option.value && (
                      <p className="text-xs text-gray-500 px-3 mt-1">
                        {option.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left bg-gray-50 w-20"></th>
                      {allColors.map(({ color, shade }) => (
                        <th
                          key={shade}
                          className="border p-2 text-center bg-gray-50 w-16"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className="w-8 h-6 rounded border"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-medium">{shade}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allColors.map(({ color: textColor, shade: textShade }) => (
                      <tr key={textShade}>
                        <td className="border p-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-6 rounded border"
                              style={{ backgroundColor: textColor }}
                            />
                            <span className="text-xs font-medium">
                              {textShade}
                            </span>
                          </div>
                        </td>
                        {allColors.map(({ color: bgColor, shade: bgShade }) => {
                          const contrast = getContrastForCombination(
                            bgColor,
                            textColor
                          );
                          const shouldShow = shouldShowCell(contrast);
                          const bestTextColor = getBestTextColor(
                            bgColor,
                            selectedGuideline
                          );

                          return (
                            <td key={bgShade} className="border p-1">
                              {shouldShow ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div
                                      className="w-full h-12 rounded flex items-center justify-center text-sm font-mono cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                                      style={{ backgroundColor: bgColor }}
                                    >
                                      <span
                                        style={{ color: bestTextColor }}
                                        className="font-bold"
                                      >
                                        {getContrastDisplayValue(contrast)}
                                      </span>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">
                                          {getContrastLabel()}{" "}
                                          {getContrastDisplayValue(contrast)}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                          {getContrastRating(contrast).icon}
                                          <span
                                            className={`text-xs font-medium ${
                                              getContrastRating(contrast).color
                                            }`}
                                          >
                                            {getContrastRating(contrast).rating}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <div>
                                          <span className="text-xs text-gray-600">
                                            Background
                                          </span>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div
                                              className="w-6 h-4 rounded border"
                                              style={{
                                                backgroundColor: bgColor,
                                              }}
                                            />
                                            <span className="text-xs font-mono">
                                              {bgColor}
                                            </span>
                                          </div>
                                        </div>

                                        <div>
                                          <span className="text-xs text-gray-600">
                                            Text
                                          </span>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div
                                              className="w-6 h-4 rounded border"
                                              style={{
                                                backgroundColor: textColor,
                                              }}
                                            />
                                            <span className="text-xs font-mono">
                                              {textColor}
                                            </span>
                                          </div>
                                        </div>

                                        <div>
                                          <span className="text-xs text-gray-600">
                                            Best Text Color
                                          </span>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div
                                              className="w-6 h-4 rounded border"
                                              style={{
                                                backgroundColor: bestTextColor,
                                              }}
                                            />
                                            <span className="text-xs font-mono">
                                              {bestTextColor}
                                            </span>
                                          </div>
                                        </div>

                                        {/* APCA Explanation */}
                                        {selectedGuideline ===
                                          "WCAG 3 (APCA)" && (
                                          <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="text-xs text-gray-600 mb-2">
                                              <strong>APCA Value:</strong>{" "}
                                              {contrast}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {contrast > 0 ? (
                                                <span>
                                                  Dark text on light background
                                                </span>
                                              ) : (
                                                <span>
                                                  Light text on dark background
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                              {Math.abs(contrast) >= 75
                                                ? "Excellent contrast"
                                                : Math.abs(contrast) >= 60
                                                ? "Good contrast"
                                                : Math.abs(contrast) >= 45
                                                ? "Acceptable contrast"
                                                : "Poor contrast"}
                                            </div>
                                          </div>
                                        )}

                                        {/* WCAG 2 Explanation */}
                                        {selectedGuideline === "WCAG 2" && (
                                          <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="text-xs text-gray-600 mb-2">
                                              <strong>WCAG 2 Ratio:</strong>{" "}
                                              {contrast.toFixed(1)}:1
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {contrast >= 7
                                                ? "AAA level - Excellent for all text"
                                                : contrast >= 4.5
                                                ? "AA level - Good for normal text"
                                                : contrast >= 3
                                                ? "A level - Minimum for large text"
                                                : "Below minimum requirements"}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <div className="w-full h-12 bg-gray-100 bg-opacity-50" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get color name
function getColorName(hex: string): string {
  const colorNames: { [key: string]: string } = {
    "#ff0000": "Red",
    "#00ff00": "Green",
    "#0000ff": "Blue",
    "#ffff00": "Yellow",
    "#ff00ff": "Magenta",
    "#00ffff": "Cyan",
    "#ff8000": "Orange",
    "#8000ff": "Purple",
    "#0080ff": "Electric Blue",
    "#ff0080": "Pink",
    "#80ff00": "Lime",
    "#800080": "Purple",
    "#008080": "Teal",
    "#800000": "Maroon",
    "#808000": "Olive",
    "#000080": "Navy",
    "#808080": "Gray",
    "#c0c0c0": "Silver",
    "#ffffff": "White",
    "#000000": "Black",
  };

  return colorNames[hex.toLowerCase()] || "Custom";
}
