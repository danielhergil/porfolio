export default function Experience() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white">Work Experience</h1>
      <div className="relative border-l border-gray-600 pl-8 md:pl-8 space-y-8 md:space-y-12">
        <div className="relative">
          <div className="absolute -left-[1.65rem] md:-left-10 mt-2 w-3 h-3 bg-blue-500 rounded-full" />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-blue-400">Automation Engineer</div>
            <div className="text-gray-400">Game Strategies</div>
            <div className="text-sm text-gray-500">2020 - Present</div>
            <div className="text-gray-300">
              I started in this position working in test automation for a microservices architecture, building projects in JS and Python providing the dev teams End-2-End testing scenarios.<br />
              During this journey I start automating the deployment pipelines using Github Actions and by now I am mostly automating infrastructure doing the next tasks:<br /><br />
              <ul className="list-disc list-inside text-gray-300 space-y-1 pl-4">
                <li>Automated testing runs before branch merge.</li>
                <li>Implement event-driven insfrastructure using Redis and Argo.</li>
                <li>Bash scripting for Docker images execution in Kubernetes environment.</li>
                <li>DevOps backup (still learning).</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -left-[1.65rem] md:-left-10 mt-2 w-3 h-3 bg-green-500 rounded-full" />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-green-400">Full Stack Developer</div>
            <div className="text-gray-400">Ceita SL</div>
            <div className="text-sm text-gray-500">2018 - 2020</div>
            <div className="text-gray-300">
              Full Stack development for bank corporation. Used BPM similar to SAP and PostgreSQL database.<br />
              I built a framework using Java and Fitnesse to provide a tool for testing automation to the dev team.<br />
              During this working period, I started doing the first deployments in production environment including front, back and database.<br />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[1.65rem] md:-left-10 mt-2 w-3 h-3 bg-purple-500 rounded-full" />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-purple-400">Junior Developer</div>
            <div className="text-gray-400">Indra</div>
            <div className="text-sm text-gray-500">2017 - 2018</div>
            <div className="text-gray-300">
              Started as a junior developer working on front and back development. Gained experience with Java and Web Services.<br />
              I learned the development lifecycle and use git to work in a shared environment.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

