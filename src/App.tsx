import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import UserProfileModal from './components/UserProfileModal'
import { GlobalBadgeListener } from './components/GlobalBadgeListener'
import { HomePage } from './pages/HomePage'
import UserDashboard from './pages/UserDashboard'
import RungChuongVangGame from './games/rung-chuong-vang'
import VuiHocGiaoLyGame from './games/vui-hoc-giao-ly'
import LotteryGame from './games/ung-dung-xo-so/LotteryGame'
import TaoQuizDoVuiGame from './games/tao-quiz-do-vui'
import LoToGame from './games/lo-to'
import ChiecNonKyDieu from './games/chiec-non-ky-dieu'
import SapXepKinhThanh from './games/sap-xep-kinh-thanh'
import AiLaTrieuPhuGame from './games/ai-la-trieu-phu'
import MemoryGame from './games/lat-hinh'
import CrosswordGame from './games/o-chu-kinh-thanh'
import Header from './components/Header'
import Footer from './components/Footer'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PolicyPage } from './pages/PolicyPage'

function AppLayout() {
  const location = useLocation()
  const isPlayingGame = location.pathname.startsWith('/games')

  return (
    <div className={isPlayingGame ? 'h-[100dvh] flex flex-col overflow-hidden relative' : 'flex flex-col min-h-screen relative'}>
      <Header />
      
      <main className={`flex-1 flex flex-col relative ${isPlayingGame ? 'overflow-hidden [&>div]:!min-h-full [&>div]:!h-full' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/chinh-sach" element={<PolicyPage />} />
          <Route path="/games/rung-chuong-vang" element={<RungChuongVangGame />} />
          <Route path="/games/vui-hoc-giao-ly" element={<VuiHocGiaoLyGame />} />
          <Route path="/games/ung-dung-xo-so" element={<LotteryGame />} />
          <Route path="/games/tao-quiz-do-vui" element={<TaoQuizDoVuiGame />} />
          <Route path="/games/lo-to" element={<LoToGame />} />
          <Route path="/games/chiec-non-ky-dieu" element={<ChiecNonKyDieu />} />
          <Route path="/games/sap-xep-kinh-thanh" element={<SapXepKinhThanh />} />
          <Route path="/games/ai-la-trieu-phu" element={<AiLaTrieuPhuGame />} />
          <Route path="/games/lat-hinh" element={<MemoryGame />} />
          {/* Placeholder for future games */}
          <Route path="/games/o-chu-cong-giao" element={<CrosswordGame />} />
          <Route path="/games/dua-thuyen" element={<div className="p-8 text-center text-xl">Đang phát triển...</div>} />
        </Routes>
      </main>

      {!isPlayingGame && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Modals */}
        <AuthModal />
        <UserProfileModal />
        <GlobalBadgeListener />

        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  )
}
