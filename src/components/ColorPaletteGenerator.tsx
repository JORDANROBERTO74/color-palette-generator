"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useColorPalette } from "@/lib/hooks/useColorPalette";
import ColorPalette from "./ColorPalette";
import ExportDialog from "./ExportDialog";
import ContrastGrid from "./ContrastGrid";
import { useState, useMemo } from "react";
import { parseColorString, isValidHexColor } from "@/lib/colorUtils";
import { useEffect, useRef } from "react";

// Lazy load ExampleComponents for better performance
const ExampleComponents = dynamic(() => import("./ExampleComponents"), {
  loading: () => (
    <div>
      <h2 id="examples-heading" className="text-lg font-medium">
        Example components using the color palette
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[350px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  ),
  ssr: false,
});

export default function ColorPaletteGenerator() {
  const {
    primaryColor,
    palette,
    copiedColor,
    focusedIndex,
    colorFormat,
    formattedColor,
    setPrimaryColor,
    setColorFormat,
    copyToClipboard,
    handleKeyDown,
    handlePaletteKeyDown,
  } = useColorPalette();

  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formattedColor);
  const [isEditing, setIsEditing] = useState(false);
  const [isContrastGridOpen, setIsContrastGridOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Memoize expensive operations
  const formatOptions = useMemo(
    () => [
      { value: "hex", label: "HEX" },
      { value: "hsl", label: "HSL" },
      { value: "oklch", label: "OKLCH" },
    ],
    []
  );

  const predefinedColors = useMemo(
    () => [
      { name: "Rojo", value: "#FF0000" },
      { name: "Amarillo", value: "#FFFF00" },
      { name: "Verde", value: "#00FF00" },
      { name: "Rosa", value: "#FFC0CB" },
      { name: "Negro", value: "#000000" },
      { name: "Blanco", value: "#FFFFFF" },
      { name: "Azul", value: "#0000FF" },
      { name: "Naranja", value: "#FFA500" },
      { name: "Morado", value: "#800080" },
      { name: "Cyan", value: "#00FFFF" },
    ],
    []
  );

  // Update input value when formattedColor changes
  useEffect(() => {
    setInputValue(formattedColor);
  }, [formattedColor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside format dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFormatDropdownOpen(false);
      }

      // Check if click is outside color dropdown
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsColorDropdownOpen(false);
      }

      // Check if click is outside input and sliders area
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (value: string) => {
    setInputValue(value);
    setIsEditing(true);

    // For hex format, always try to parse and update
    if (colorFormat === "hex") {
      const parsedColor = parseColorString(value);
      if (parsedColor !== value) {
        setPrimaryColor(parsedColor);
        setIsEditing(false);
      }
      return;
    }

    // For HSL format, only update if the input is a complete valid format
    if (colorFormat === "hsl") {
      const hslMatch = value.match(
        /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/
      );
      if (hslMatch) {
        const h = parseInt(hslMatch[1]);
        const s = parseInt(hslMatch[2]);
        const l = parseInt(hslMatch[3]);

        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
          const parsedColor = parseColorString(value);
          setPrimaryColor(parsedColor);
          setIsEditing(false);
        }
      }
      return;
    }

    // For OKLCH format, only update if the input is a complete valid format
    if (colorFormat === "oklch") {
      const oklchMatch = value.match(/oklch\(\s*(\d+)%\s+(\d+)%\s+(\d+)\s*\)/);
      if (oklchMatch) {
        const l = parseInt(oklchMatch[1]);
        const c = parseInt(oklchMatch[2]);
        const h = parseInt(oklchMatch[3]);

        if (l >= 0 && l <= 100 && c >= 0 && c <= 100 && h >= 0 && h <= 360) {
          const parsedColor = parseColorString(value);
          setPrimaryColor(parsedColor);
          setIsEditing(false);
        }
      }
      return;
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);

    // Only reset if the current input is not a valid format
    if (colorFormat === "hex") {
      if (!isValidHexColor(inputValue)) {
        setInputValue(formattedColor);
      }
    } else if (colorFormat === "hsl") {
      const hslMatch = inputValue.match(
        /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/
      );
      if (!hslMatch) {
        setInputValue(formattedColor);
      }
    } else if (colorFormat === "oklch") {
      const oklchMatch = inputValue.match(
        /oklch\(\s*(\d+)%\s+(\d+)%\s+(\d+)\s*\)/
      );
      if (!oklchMatch) {
        setInputValue(formattedColor);
      }
    }
  };

  // Function to check if current input is valid
  const isInputValid = () => {
    if (colorFormat === "hex") {
      return isValidHexColor(inputValue);
    } else if (colorFormat === "hsl") {
      const hslMatch = inputValue.match(
        /hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/
      );
      if (hslMatch) {
        const h = parseInt(hslMatch[1]);
        const s = parseInt(hslMatch[2]);
        const l = parseInt(hslMatch[3]);
        return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
      }
      return false;
    } else if (colorFormat === "oklch") {
      const oklchMatch = inputValue.match(
        /oklch\(\s*(\d+)%\s+(\d+)%\s+(\d+)\s*\)/
      );
      if (oklchMatch) {
        const l = parseInt(oklchMatch[1]);
        const c = parseInt(oklchMatch[2]);
        const h = parseInt(oklchMatch[3]);
        return l >= 0 && l <= 100 && c >= 0 && c <= 100 && h >= 0 && h <= 360;
      }
      return false;
    }
    return true;
  };

  const handleFormatChange = (format: "hex" | "hsl" | "oklch") => {
    setColorFormat(format);
    setIsFormatDropdownOpen(false);
  };

  const handleColorSelection = (colorValue: string) => {
    setPrimaryColor(colorValue);
    setIsColorDropdownOpen(false);
  };

  return (
    <div className="h-full w-[100vw] md:w-full bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Palettor</h1>
          <p className="text-lg text-gray-600">
            Create professional color palettes with one click
          </p>
        </div>

        {/* Top Section - Centered Color Input */}
        <div className="flex flex-col items-center mb-8">
          {/* Central Color Input Section */}
          <div
            className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 shadow-sm max-w-[300px] w-full"
            role="group"
            aria-labelledby="color-input-label"
            ref={inputRef}
          >
            <div className="relative flex-1">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => handleColorChange(e.target.value)}
                className={`w-full font-mono text-sm border-0 bg-transparent focus:ring-0 pl-12 pr-20 ${
                  isEditing ? "ring-2 ring-blue-500 ring-opacity-50" : ""
                }`}
                placeholder="#808080"
                aria-label="Enter color code"
                title="Enter a color code"
                onBlur={handleInputBlur}
              />

              {/* Color Picker positioned on the left side */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-6 h-6 p-0 border-0 cursor-pointer"
                  aria-label="Select primary color"
                  title="Click to open color picker"
                />
              </div>

              {/* Format Selector positioned on the right side */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center gap-1 bg-white px-2 py-1 rounded border cursor-pointer hover:bg-gray-50"
                    role="button"
                    tabIndex={0}
                    aria-label="Color format selector"
                    title="Select color format"
                    onClick={() =>
                      setIsFormatDropdownOpen(!isFormatDropdownOpen)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsFormatDropdownOpen(!isFormatDropdownOpen);
                      }
                    }}
                  >
                    <span className="text-xs text-gray-600">
                      {colorFormat.toUpperCase()}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gray-500 transition-transform ${
                        isFormatDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isFormatDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[80px]">
                      {formatOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            colorFormat === option.value
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          }`}
                          onClick={() =>
                            handleFormatChange(
                              option.value as "hex" | "hsl" | "oklch"
                            )
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Positioned below and to the right */}
          <div className="flex items-center gap-2 mt-4 w-full">
            {/* Color Selection Dropdown - Positioned to the left */}
            <div className="relative" ref={colorDropdownRef}>
              <div
                className="flex items-center gap-1 bg-white px-3 py-2 rounded border cursor-pointer hover:bg-gray-50 text-xs"
                role="button"
                tabIndex={0}
                aria-label="Color selector"
                title="Select predefined color"
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsColorDropdownOpen(!isColorDropdownOpen);
                  }
                }}
              >
                <span className="text-gray-600">Colores</span>
                <ChevronDown
                  className={`w-3 h-3 text-gray-500 transition-transform ${
                    isColorDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Color Dropdown Menu */}
              {isColorDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px] max-h-60 overflow-y-auto">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                      onClick={() => handleColorSelection(color.value)}
                    >
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-gray-700">{color.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  aria-label="Open contrast grid"
                  title="View color contrast grid"
                  onClick={() => setIsContrastGridOpen(true)}
                >
                  <Grid className="w-3 h-3 mr-1" />
                  Contrast grid
                </Button>
              </div>
              <ExportDialog palette={palette} primaryColor={primaryColor} />
            </div>
          </div>
        </div>

        {/* Color Palette Row */}
        <ColorPalette
          palette={palette}
          copiedColor={copiedColor}
          focusedIndex={focusedIndex}
          primaryColor={primaryColor}
          onColorClick={copyToClipboard}
          onKeyDown={handleKeyDown}
          onPaletteKeyDown={handlePaletteKeyDown}
          isInputValid={isInputValid()}
          colorFormat={colorFormat}
        />

        {/* Example Components */}
        <ExampleComponents primaryColor={primaryColor} />

        {/* Contrast Grid Dialog */}
        <ContrastGrid
          isOpen={isContrastGridOpen}
          onClose={() => setIsContrastGridOpen(false)}
          palette={palette}
          primaryColor={primaryColor}
        />
      </div>
    </div>
  );
}
