import HeroCarousel from '../../../shared/components/HeroCarousel'
import { heroSlides } from '../data/heroSlides'

export default function HeroSlider() {
  return <HeroCarousel slides={heroSlides} />
}
