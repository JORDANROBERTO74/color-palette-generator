"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Palette, Sparkles } from "lucide-react";
import { generateColorPalette, isValidHexColor } from "@/lib/colorUtils";

export default function ColorPaletteGenerator() {
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    if (isValidHexColor(primaryColor)) {
      const newPalette = generateColorPalette(primaryColor);
      setPalette(newPalette);
    }
  }, [primaryColor]);

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy color:", err);
    }
  };

  const generateRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setPrimaryColor(randomColor);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  const colorVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Palette className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Color Palette Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Create harmonious color palettes from a primary color
          </p>
        </motion.div>

        {/* Color Input Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Primary Color
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-input">Select a color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-input"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-12 p-1 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                  <Button
                    onClick={generateRandomColor}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Color Palette Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
        >
          <AnimatePresence>
            {palette.map((color, index) => (
              <motion.div
                key={`${color}-${index}`}
                variants={itemVariants}
                layout
                className="group"
              >
                <motion.div
                  variants={colorVariants}
                  className="relative aspect-square rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                      background: [
                        `radial-gradient(circle at 20% 20%, ${color} 0%, transparent 50%)`,
                        `radial-gradient(circle at 80% 80%, ${color} 0%, transparent 50%)`,
                        `radial-gradient(circle at 20% 20%, ${color} 0%, transparent 50%)`,
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  {/* Copy indicator */}
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <Copy className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Copied indicator */}
                  <AnimatePresence>
                    {copiedColor === color && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-green-500 bg-opacity-80 flex items-center justify-center"
                      >
                        <span className="text-white font-semibold text-sm">
                          Copied!
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="mt-2 text-center">
                  <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    {color}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12 text-slate-500 dark:text-slate-400"
        >
          <p className="text-sm">Click on any color to copy it to clipboard</p>
        </motion.div>
      </div>
    </div>
  );
}
