import { Fragment } from 'react'
import HeroSlider from '../components/HeroSlider'
import CategorySection from '../components/CategorySection'
import BannerSection from '../components/BannerSection'
import { categorySections } from '../data/categorySections'
import { bannerSections } from '../data/bannerSections'

export default function HomePage() {
  return (
    <div>
      <div className="px-4 pt-4">
        <HeroSlider />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:gap-3">
        {categorySections.map((section, index) => {
          const bannersAfter = bannerSections[index]

          return (
            <Fragment key={section.id}>
              <CategorySection {...section} />
              {index < categorySections.length - 1 && bannersAfter ? (
                <BannerSection banners={bannersAfter.banners} />
              ) : null}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
