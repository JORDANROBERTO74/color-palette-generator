"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  ShoppingCart,
  Star,
  Heart,
  Check,
  Shield,
  Battery,
  Wifi,
  Clock,
  Tag,
  MapPin,
  GripVertical,
} from "lucide-react";
import { hexToHsl } from "@/lib/colorUtils";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";

interface ExampleComponentsProps {
  primaryColor: string;
}

export default function ExampleComponents({
  primaryColor,
}: ExampleComponentsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [inputOrder, setInputOrder] = useState([0, 1, 2, 3]);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newOrder = [...inputOrder];
      const draggedItem = newOrder[draggedIndex];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(index, 0, draggedItem);
      setInputOrder(newOrder);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const inputFields = [
    { label: "Full Name", placeholder: "Enter your full name" },
    { label: "Email", placeholder: "Enter your email" },
    { label: "Phone", placeholder: "Enter your phone" },
    { label: "Address", placeholder: "Enter your address" },
  ];

  const plans = [
    {
      name: "Basic Plan",
      price: 9,
      features: ["Up to 5 projects", "Basic analytics", "Email support"],
    },
    {
      name: "Pro Plan",
      price: 19,
      features: ["Up to 20 projects", "Advanced analytics", "Priority support"],
    },
    {
      name: "Enterprise",
      price: 49,
      features: ["Unlimited projects", "Custom analytics", "24/7 support"],
    },
  ];

  return (
    <section aria-labelledby="examples-heading">
      <h2 id="examples-heading" className="text-lg font-medium">
        Example components using the color palette
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Dashboard Widget Example */}
        <Card className="h-full">
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
        <Card className="h-full">
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

        {/* Subscription Statistics Example */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <Button
                size="sm"
                className="text-xs text-white"
                style={{ backgroundColor: primaryColor }}
                aria-label="View Details"
              >
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-between gap-4">
            {/* Metrics */}
            <div className="space-y-1">
              <div
                className="text-2xl font-bold"
                style={{ color: primaryColor }}
              >
                +2,350
              </div>
              <div className="text-sm text-gray-600">
                +180.1% from last month
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-full w-full">
              <ChartContainer
                config={{
                  subscriptions: {
                    color: primaryColor,
                    label: "Subscriptions",
                  },
                }}
              >
                <AreaChart
                  data={[
                    { month: "Jan", subscriptions: 1200 },
                    { month: "Feb", subscriptions: 1400 },
                    { month: "Mar", subscriptions: 1100 },
                    { month: "Apr", subscriptions: 1800 },
                    { month: "May", subscriptions: 1600 },
                    { month: "Jun", subscriptions: 2200 },
                    { month: "Jul", subscriptions: 2350 },
                  ]}
                >
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {payload[0].payload.month}
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscriptions"
                    stroke={primaryColor}
                    fill={primaryColor}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: primaryColor }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Card Example */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Product Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Product Image Placeholder */}
              <div
                className="w-full h-24 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <ShoppingCart
                  className="w-8 h-8"
                  style={{ color: primaryColor }}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">Wireless Headphones</h3>
                    <p className="text-xs text-gray-600">
                      Premium Sound Quality with Active Noise Cancellation
                    </p>
                  </div>
                  <button
                    className="p-1 transition-colors hover:bg-gray-100 rounded"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorite
                          ? "text-red-500 fill-current"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Specifications */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">40h Battery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Bluetooth 5.0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">2 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Free Returns</span>
                  </div>
                </div>

                {/* Availability & Shipping */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <span style={{ color: primaryColor, fontWeight: "bold" }}>
                        In Stock
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>Free Shipping</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>Delivers by Dec 15-18</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= 4
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">(128 reviews)</span>
                  <span className="text-xs text-gray-500">• 4.2/5</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-lg font-bold"
                      style={{ color: primaryColor }}
                    >
                      $89.99
                    </span>
                    <span className="text-xs text-gray-500 line-through ml-2">
                      $129.99
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full text-white font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    -31%
                  </span>
                </div>

                {/* Additional Features */}
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                    Noise Cancelling
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                    Wireless
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                    Touch Controls
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                    Fast Charging
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    Quick View
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Draggable Input Group Example */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Draggable Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-xs text-gray-600 mb-3">
                Drag to reorder form fields
              </p>

              {inputOrder.map((index, position) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(position)}
                  onDragOver={(e) => handleDragOver(e, position)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 border rounded-lg cursor-grab transition-all ${
                    draggedIndex === position ? "opacity-50" : ""
                  }`}
                  style={{
                    borderColor:
                      draggedIndex === position ? primaryColor : "#e5e7eb",
                    backgroundColor:
                      draggedIndex === position ? `${primaryColor}05` : "white",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-700 block mb-1">
                        {inputFields[index].label}
                      </label>
                      <input
                        type="text"
                        placeholder={inputFields[index].placeholder}
                        className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                        style={
                          {
                            borderColor: "#d1d5db",
                            "--tw-ring-color": primaryColor,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full text-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Submit Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Choose Plan Component Example */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Choose Plan</CardTitle>
            <CardDescription className="text-xs text-gray-600">
              Select the perfect plan for your needs. All plans include our core
              features with different limits and additional benefits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Plan Options */}
              <div className="space-y-2">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`px-3 py-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan === index ? "border-2" : "border"
                    }`}
                    style={{
                      borderColor:
                        selectedPlan === index ? primaryColor : "#e5e7eb",
                      backgroundColor:
                        selectedPlan === index ? `${primaryColor}05` : "white",
                    }}
                    onClick={() => setSelectedPlan(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === index
                              ? "border-current"
                              : "border-gray-300"
                          }`}
                          style={{
                            color:
                              selectedPlan === index ? primaryColor : "#9ca3af",
                          }}
                        >
                          {selectedPlan === index && (
                            <Check className="w-2.5 h-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{plan.name}</div>
                          <div className="text-xs text-gray-600">
                            ${plan.price}/month
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${plan.price}</div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Features */}
              <div className="pt-2">
                <div className="text-xs font-medium mb-2">
                  {plans[selectedPlan].name} includes:
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {plans[selectedPlan].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <Check
                        className="w-3 h-3"
                        style={{ color: primaryColor }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full text-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Select {plans[selectedPlan].name}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
