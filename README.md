# GradeIQ — Smart GPA & CGPA Calculator

A modern, responsive GPA calculator built with **Next.js 14**, **TypeScript**, **TailwindCSS**, and **Framer Motion**.

## Features

- **Semester GPA Calculator** — Add courses, grade points, credit hours; get real-time GPA
- **CGPA Calculator** — Multi-semester tracking with collapsible cards and live CGPA
- **Goal GPA Calculator** — Predict your final CGPA based on remaining semesters

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Google Fonts (DM Sans + DM Serif Display) | Typography |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
gradeiq/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── gpa/
│   │   └── page.tsx        # GPA Calculator page
│   ├── cgpa/
│   │   └── page.tsx        # CGPA Calculator page
│   └── needed/
│       └── page.tsx        # Goal GPA Calculator page
├── components/
│   ├── Navbar.tsx          # Sticky responsive navbar
│   ├── Footer.tsx          # Site footer
│   ├── HomeClient.tsx      # Animated home page
│   ├── GPACalculator.tsx   # Semester GPA calculator
│   ├── CGPACalculator.tsx  # Multi-semester CGPA calculator
│   ├── NeededGPACalculator.tsx  # Goal GPA calculator
│   ├── CourseRow.tsx       # Reusable course input row
│   ├── ResultPanel.tsx     # GPA result display card
│   └── CalculatorCard.tsx  # Card wrapper + table header
├── lib/
│   └── utils.ts            # Types, calculation utilities, helpers
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## GPA Formula

```
GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)
```

Typical 4.0 scale:
- A = 4.00, A− = 3.70
- B+ = 3.30, B = 3.00, B− = 2.70
- C+ = 2.30, C = 2.00, C− = 1.70
- D = 1.00, F = 0.00

## Design System

- **Primary**: `#009688` (Teal)
- **Background**: `#F4FAF9` (Soft Mint)
- **Text**: `#0A1C2A` (Deep Navy)
- **Fonts**: DM Serif Display (headings) + DM Sans (body)
