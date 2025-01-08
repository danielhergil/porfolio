import { Github, Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const projects = [
  {
    title: "AI Chatbot",
    description: "A sophisticated chatbot powered by machine learning and natural language processing",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    technologies: ["Python", "TensorFlow", "Flask"],
    github: "https://github.com/yourusername/ai-chatbot",
    demo: "https://ai-chatbot-demo.com",
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory management",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/yourusername/ecommerce",
    demo: "https://ecommerce-demo.com",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather tracking application with interactive maps",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    technologies: ["JavaScript", "Weather API", "D3.js"],
    github: "https://github.com/yourusername/weather-app",
    demo: "https://weather-demo.com",
    color: "from-yellow-500 to-orange-500"
  }
]

export default function Projects() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden bg-[#2d2d2d] hover:bg-[#333333] transition-colors"
          >
            <div className={`h-24 md:h-32 bg-gradient-to-r ${project.color} p-4 md:p-6 flex items-center justify-center`}>
              <Image
                src={project.image}
                alt={project.title}
                width={48}
                height={48}
                className="filter brightness-0 invert"
              />
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              <p className="text-gray-400">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm rounded-full bg-[#1e1e1e] text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex space-x-4 pt-4">
                <Link
                  href={project.github}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                  target="_blank"
                >
                  <Github className="w-5 h-5" />
                  <span>Code</span>
                </Link>
                <Link
                  href={project.demo}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                  target="_blank"
                >
                  <Globe className="w-5 h-5" />
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

