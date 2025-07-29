"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users } from "lucide-react";
import { hexToHsl } from "@/lib/colorUtils";

interface ExampleComponentsProps {
  primaryColor: string;
}

export default function ExampleComponents({
  primaryColor,
}: ExampleComponentsProps) {
  // Generate a name based on the color
  const getColorName = (color: string) => {
    const hsl = hexToHsl(color);
    if (hsl.h >= 0 && hsl.h < 30) return "Red";
    if (hsl.h >= 30 && hsl.h < 60) return "Orange";
    if (hsl.h >= 60 && hsl.h < 90) return "Yellow";
    if (hsl.h >= 90 && hsl.h < 150) return "Green";
    if (hsl.h >= 150 && hsl.h < 210) return "Cyan";
    if (hsl.h >= 210 && hsl.h < 270) return "Blue";
    if (hsl.h >= 270 && hsl.h < 330) return "Purple";
    return "Pink";
  };

  const colorName = useMemo(() => getColorName(primaryColor), [primaryColor]);

  return (
    <section aria-labelledby="examples-heading">
      <h2 id="examples-heading" className="text-lg font-medium">
        Example components using the color palette
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Dashboard Widget Example */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {colorName} Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Revenue Metric */}
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: primaryColor }}
                  >
                    $12,450
                  </div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>

                {/* Users Metric */}
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: primaryColor }}
                  >
                    2,847
                  </div>
                  <div className="text-xs text-gray-600">Users</div>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Weekly Growth</span>
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
                <div className="h-16 flex items-end gap-1">
                  {[40, 65, 45, 80, 60, 75, 90].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${height}%`,
                        backgroundColor:
                          index === 6 ? primaryColor : `${primaryColor}40`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 text-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Picker Example */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">September 2022</div>
              <div
                className="grid grid-cols-7 gap-1 text-xs"
                role="grid"
                aria-label="Calendar for September 2022"
              >
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <div
                    key={day}
                    className="p-1 text-gray-500"
                    role="columnheader"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                  const isSelected = date === 20;
                  const isHighlighted = date >= 15 && date <= 21;
                  return (
                    <div
                      key={date}
                      className={`p-1 rounded ${
                        isSelected
                          ? "text-white font-medium"
                          : isHighlighted
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? primaryColor
                          : isHighlighted
                          ? `${primaryColor}20`
                          : "transparent",
                      }}
                      role="gridcell"
                      aria-label={`Date ${date}${
                        isSelected ? " (selected)" : ""
                      }${isHighlighted ? " (highlighted)" : ""}`}
                      tabIndex={isSelected || isHighlighted ? 0 : -1}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  aria-label="Cancel date selection"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Continue with selected date"
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator Example */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {/* Circular Progress */}
              <div className="relative w-16 h-16 mx-auto mb-4">
                <svg
                  className="w-16 h-16 transform -rotate-90"
                  viewBox="0 0 64 64"
                  role="img"
                  aria-label="Progress indicator showing 75% completion"
                >
                  {/* Background circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                    aria-hidden="true"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={primaryColor}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.75)}`}
                    strokeLinecap="round"
                    aria-hidden="true"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-sm font-bold"
                    style={{ color: primaryColor }}
                    aria-label="75 percent complete"
                  >
                    75%
                  </span>
                </div>
              </div>

              {/* Avatars */}
              <div
                className="flex justify-center gap-1 mb-2"
                role="list"
                aria-label="Team members avatars"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white"
                    style={{
                      backgroundColor: primaryColor,
                      opacity: 0.7 + i * 0.05,
                    }}
                    role="listitem"
                    aria-label={`Team member ${i + 1} avatar`}
                  />
                ))}
              </div>

              <div
                className="text-xs font-medium"
                style={{ color: primaryColor }}
                aria-label={`The ${colorName} project`}
              >
                The {colorName} project
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
