import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ProductViewer from "./components/ProductViewer"
import Showcase from "./components/Showcase";
import Highlights from "./components/highlights";
import Footer from "./components/Footer"
import Performance from "./components/Perfomance"
import Features from "./components/Features"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"



gsap.registerPlugin(ScrollTrigger)

function App() {
  return (
    <>
     <main>
      <Navbar />
      <Hero />
      <ProductViewer />
      <Showcase />
      <Performance />
      <Features />
      <Highlights />
      <Footer />
     </main>
    </>
  )
}

export default App
