import { Mail, Phone, Github, Linkedin, MapPin, Globe, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Contact() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Contact Information</h1>
      <div className="grid gap-6 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#2d2d2d] p-6 rounded-lg space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Email</h2>
            <a 
              href="mailto:john.doe@example.com" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              daniel.hergil@gmail.com
            </a>
          </div>

          <div className="bg-[#2d2d2d] p-6 rounded-lg space-y-4">
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Location</h2>
            <p className="text-gray-400">Madrid, Spain</p>
          </div>

          <div className="bg-[#2d2d2d] p-6 rounded-lg space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Availability</h2>
            <p className="text-gray-400">Open to opportunities</p>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-4 md:p-6 rounded-lg mt-4 md:mt-6">
          <h2 className="text-xl font-semibold text-white mb-4 md:mb-6">Connect with me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://github.com/danielhergil" 
              target="_blank"
              className="flex items-center space-x-3 p-4 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors"
            >
              <Github className="w-6 h-6" />
              <div>
                <div className="font-medium text-white">GitHub</div>
                <div className="text-sm text-gray-400">@danielhergil</div>
              </div>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/daniel-hern%C3%A1ndez-gil-259877105/" 
              target="_blank"
              className="flex items-center space-x-3 p-4 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors"
            >
              <Linkedin className="w-6 h-6" />
              <div>
                <div className="font-medium text-white">LinkedIn</div>
                <div className="text-sm text-gray-400">Daniel Hernández Gil</div>
              </div>
            </a>

            <a 
              href="" 
              target="_blank"
              className="flex items-center space-x-3 p-4 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors"
            >
              <Globe className="w-6 h-6" />
              <div>
                <div className="font-medium text-white">Portfolio</div>
                <div className="text-sm text-gray-400">Current Site</div>
              </div>
            </a>

            <a 
              href="tel:+15551234567"
              className="flex items-center space-x-3 p-4 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors"
            >
              <Phone className="w-6 h-6" />
              <div>
                <div className="font-medium text-white">Phone</div>
                <div className="text-sm text-gray-400">+34 680 50 96 43</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

