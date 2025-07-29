# 🎨 Color Palette Generator

A minimalist web application for creating harmonious color palettes from a primary color. Built with Next.js 14, shadcn/ui and Tailwind CSS.

## ✨ Features

- **Minimalist Interface**: Clean and modern design with smooth animations
- **Smart Generation**: Creates palettes based on color theory (complementary, analogous, triadic)
- **Interactive**: Click on any color to copy it to clipboard
- **Export Functionality**: Export your color palette as Tailwind CSS, CSS variables, or JSON
- **Responsive**: Works perfectly on mobile and desktop devices
- **Dark Mode**: Full dark mode support
- **Animations**: Fluid transitions with Framer Motion

## 🚀 Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Static typing for better development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern and accessible UI components
- **Framer Motion**: Animations and transitions
- **Lucide React**: Minimalist icons

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <your-repository>
cd color-palette-generator
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Builds the app for production
- `npm run start` - Runs the app in production mode
- `npm run lint` - Runs the linter

## 🎯 Usage

1. **Select a Color**: Use the color picker or enter a hexadecimal code
2. **Generate Randomly**: Click the sparkles button to generate a random color
3. **Explore the Palette**: The app automatically generates variations of the selected color
4. **Copy Colors**: Click on any color in the palette to copy it to clipboard
5. **Export Palette**: Click the "Export" button to get Tailwind CSS, CSS variables, or JSON format

## 🎨 Generation Algorithm

The app uses color theory to generate harmonious palettes:

- **Primary Color**: The base color you select
- **Lightness Variations**: Different shades of the same color
- **Complementary Colors**: Colors opposite on the color wheel
- **Analogous Colors**: Colors adjacent on the color wheel
- **Triadic Colors**: Three colors equidistant on the color wheel

## 📱 Responsive Design

The app is optimized for:

- 📱 Mobile (2 columns)
- 📱 Tablet (4 columns)
- 💻 Desktop (6 columns)
- 🖥️ Large screens (8 columns)

## 🌙 Dark Mode

The app automatically supports dark mode based on system preferences.

## 📄 License

This project is under the MIT License.

---

Built with ❤️ using Next.js 14, shadcn/ui and Tailwind CSS.
