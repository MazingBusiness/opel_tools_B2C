import TopBar from './TopBar'
import MainBar from './MainBar'
import CategoryNav from './CategoryNav'

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50">
        <TopBar />
        <MainBar />
      </header>
      <CategoryNav />
    </>
  )
}
