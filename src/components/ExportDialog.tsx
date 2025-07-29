"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ExportDialogProps {
  palette: { color: string; shade: string }[];
  primaryColor: string;
}

export default function ExportDialog({
  palette,
  primaryColor,
}: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const generateTailwindCSS = () => {
    const colorName = "primary"; // You could make this configurable
    let css = `/* Tailwind CSS Color Palette */\n`;
    css += `/* Generated from: ${primaryColor} */\n\n`;
    css += `/* Add to your tailwind.config.js */\n`;
    css += `module.exports = {\n`;
    css += `  theme: {\n`;
    css += `    extend: {\n`;
    css += `      colors: {\n`;
    css += `        ${colorName}: {\n`;

    palette.forEach(({ color, shade }) => {
      css += `          ${shade}: '${color}',\n`;
    });

    css += `        },\n`;
    css += `      },\n`;
    css += `    },\n`;
    css += `  },\n`;
    css += `};\n\n`;

    css += `/* CSS Variables (alternative) */\n`;
    css += `:root {\n`;
    palette.forEach(({ color, shade }) => {
      css += `  --color-${colorName}-${shade}: ${color};\n`;
    });
    css += `}\n\n`;

    css += `/* Usage Examples */\n`;
    css += `/* Tailwind: bg-primary-500 text-primary-900 */\n`;
    css += `/* CSS: background-color: var(--color-primary-500); */\n`;

    return css;
  };

  const generateCSSVariables = () => {
    const colorName = "primary";
    let css = `/* CSS Variables */\n`;
    css += `/* Generated from: ${primaryColor} */\n\n`;
    css += `:root {\n`;
    palette.forEach(({ color, shade }) => {
      css += `  --color-${colorName}-${shade}: ${color};\n`;
    });
    css += `}\n\n`;
    css += `/* Usage Examples */\n`;
    css += `.bg-primary-50 { background-color: var(--color-primary-50); }\n`;
    css += `.bg-primary-100 { background-color: var(--color-primary-100); }\n`;
    css += `.bg-primary-500 { background-color: var(--color-primary-500); }\n`;
    css += `.bg-primary-900 { background-color: var(--color-primary-900); }\n`;
    css += `.text-primary-500 { color: var(--color-primary-500); }\n`;
    css += `.border-primary-200 { border-color: var(--color-primary-200); }\n`;

    return css;
  };

  const generateJSON = () => {
    const colorName = "primary";
    const json = {
      name: colorName,
      baseColor: primaryColor,
      palette: palette.reduce((acc, { color, shade }) => {
        acc[shade] = color;
        return acc;
      }, {} as Record<string, string>),
    };

    return JSON.stringify(json, null, 2);
  };

  const copyToClipboard = async (content: string, section: string) => {
    try {
      // Copy the original content without line numbers
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);

      toast({
        title: "Copied to clipboard",
        description: `${section} copied successfully`,
        duration: 2000,
      });

      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const tailwindCSS = generateTailwindCSS();
  const cssVariables = generateCSSVariables();
  const jsonData = generateJSON();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          aria-label="Export color palette"
          title="Export palette as CSS, JSON, or image"
        >
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[100vw] md:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Color Palette</DialogTitle>
          <DialogDescription>
            Copy the generated code to use this color palette in your project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tailwind" className="w-full overflow-x-auto">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="tailwind">Tailwind CSS</TabsTrigger>
            <TabsTrigger value="css">CSS Variables</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="tailwind">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Tailwind CSS Configuration
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(tailwindCSS, "Tailwind CSS")}
                  className="text-xs"
                >
                  {copiedSection === "Tailwind CSS" ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {copiedSection === "Tailwind CSS" ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden border">
                <SyntaxHighlighter
                  language="javascript"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    paddingRight: "1rem",
                  }}
                >
                  {tailwindCSS}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="css" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">CSS Variables</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(cssVariables, "CSS Variables")}
                className="text-xs"
              >
                {copiedSection === "CSS Variables" ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                {copiedSection === "CSS Variables" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <SyntaxHighlighter
                language="css"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  paddingRight: "1rem",
                }}
              >
                {cssVariables}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">JSON Data</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(jsonData, "JSON")}
                className="text-xs"
              >
                {copiedSection === "JSON" ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                {copiedSection === "JSON" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <SyntaxHighlighter
                language="json"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  paddingRight: "1rem",
                }}
              >
                {jsonData}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
