import './styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsGalaxy from './components/SkillsGalaxy';
import StarryBackground from './components/StarryBackground';
import { useTranslation } from 'react-i18next';
import Contact from './components/Contact';


function App() {
  
    const { t } = useTranslation();
    
  return (
    <I18nextProvider i18n={i18n}>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Background elements */}
        <StarryBackground />
        
        {/* Fixed navigation */}
        <Navbar />
        
        {/* Main content with semantic structure */}
        <main className="relative z-10">
          <section id="hero" className="min-h-screen flex items-center justify-center">
            <Hero />
          </section>

          <section id="skills" className="min-h-screen relative py-20">
            <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              {t('Titels.Skills')}
            </h2>
              <SkillsGalaxy />
            </div>
          </section>

          <section id="projects" className="min-h-screen py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12">
                {t('Titels.Projects')}
              </h2>
              {/* Add projects content here */}
            </div>
          </section>

          <section id="contact" className="min-h-[50vh] py-20 bg-opacity-50 bg-black">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-12">
                {t('Titels.Contact')}
              </h2>
              {/* Add contact form here */}
              <Contact />
            </div>
          </section>
        </main>
      </div>
    </I18nextProvider>
  )
}

export default App