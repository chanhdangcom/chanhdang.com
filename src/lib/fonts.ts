import { cn } from '@/utils/cn'
import localFont from 'next/font/local'
import { JetBrains_Mono, Pacifico } from 'next/font/google'

const fontSans = localFont({
  src: [{
    path: "../assets/fonts/SF-Pro-Text-Regular.otf",
    weight: "400",
  }, {
    path: "../assets/fonts/SF-Pro-Text-Medium.otf",
    weight: "500",
  }, {
    path: "../assets/fonts/SF-Pro-Text-Semibold.otf",
    weight: "600",
  }, {
    path: "../assets/fonts/SF-Pro-Text-Bold.otf",
    weight: "700",
  }],
  variable: "--font-sans"
})

const fontHeading = localFont({
  src: [{
    path: "../assets/fonts/SF-Pro-Display-Regular.otf",
    weight: "400",
  }, {
    path: "../assets/fonts/SF-Pro-Display-Medium.otf",
    weight: "500",
  }, {
    path: "../assets/fonts/SF-Pro-Display-Semibold.otf",
    weight: "600",
  }, {
    path: "../assets/fonts/SF-Pro-Display-Bold.otf",
    weight: "700",
  }],
  variable: "--font-heading"
})

const fontMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono"
})

const fontHandwritten = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwritten"
})

export const fonts = cn(
  fontSans.variable,
  fontMono.variable,
  fontHeading.variable,
  fontHandwritten.variable
)