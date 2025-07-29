"use client";

import { memo } from "react";
import { Check, Copy } from "lucide-react";

interface ColorPaletteProps {
  palette: { color: string; shade: string }[];
  copiedColor: string | null;
  focusedIndex: number;
  isLoading?: boolean;
  primaryColor: string;
  onColorClick: (color: string) => void;
  onKeyDown: (event: React.KeyboardEvent, color: string) => void;
  onPaletteKeyDown: (event: React.KeyboardEvent) => void;
  isInputValid?: boolean;
  colorFormat: string;
}

const ColorPalette = memo(function ColorPalette({
  palette,
  copiedColor,
  focusedIndex,
  isLoading = false,
  primaryColor,
  onColorClick,
  onKeyDown,
  onPaletteKeyDown,
  isInputValid = true,
  colorFormat,
}: ColorPaletteProps) {
  // Show loading fallback when isLoading is true
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="sr-only">Generated Color Palette</h2>
        <div className="flex gap-1">
          {Array.from({ length: 11 }).map((_, index) => (
            <div key={index} className="flex-1">
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
              <div className="text-center mt-4">
                <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-8 mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="sr-only">Generated Color Palette</h2>
      <div
        className={`flex gap-1 rounded-lg`}
        role="grid"
        aria-label="Color palette with 11 shades"
        onKeyDown={onPaletteKeyDown}
        tabIndex={0}
      >
        {!palette?.length
          ? Array.from({ length: 11 }).map((_, index) => (
              <div key={index} className="flex-1 group">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
                <div className="text-center mt-4">
                  <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-8 mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-12" />
                </div>
              </div>
            ))
          : palette?.map(({ color, shade }, index) => (
              <div
                key={shade}
                className="flex-1 group"
                role="gridcell"
                aria-label={`Color shade ${shade}: ${color}`}
              >
                <div
                  className={`h-20 rounded cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/15 relative focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    focusedIndex === index ? "ring-2 ring-offset-2" : ""
                  }`}
                  style={{
                    backgroundColor: color,
                    ...(focusedIndex === index &&
                      ({
                        "--tw-ring-color": primaryColor,
                        "--tw-ring-opacity": "1",
                      } as React.CSSProperties)),
                  }}
                  onClick={() => onColorClick(color)}
                  onKeyDown={(e) => onKeyDown(e, color)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Copy color ${color} to clipboard`}
                  title={`Click to copy ${color} to clipboard`}
                >
                  {/* Copy indicator */}
                  <div
                    className={`absolute inset-0 ${
                      copiedColor === color ? "bg-opacity-100" : "bg-opacity-0"
                    } group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center`}
                  >
                    {copiedColor === color ? (
                      <Check
                        className={`w-4 h-4 text-white ${
                          copiedColor === color ? "opacity-100" : "opacity-0"
                        } group-hover:opacity-100 transition-opacity duration-200`}
                      />
                    ) : (
                      <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs font-mono text-gray-600">
                    {shade}
                  </span>
                  <div className="text-xs font-mono text-gray-400 mt-1 truncate">
                    {color}
                  </div>
                </div>
              </div>
            ))}
      </div>
      {!isInputValid && (
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Invalid color format. Please enter a valid{" "}
            {colorFormat.toUpperCase()} color.
          </p>
        </div>
      )}
    </div>
  );
});

export default ColorPalette;
