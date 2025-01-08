export default function Experience() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white">Work Experience</h1>
      <div className="relative border-l border-gray-600 pl-8 md:pl-8 space-y-8 md:space-y-12">
        <div className="relative">
          <div className="absolute -left-[1.65rem] md:-left-10 mt-2 w-3 h-3 bg-blue-500 rounded-full" />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-blue-400">Senior Developer</div>
            <div className="text-gray-400">Tech Innovators Inc.</div>
            <div className="text-sm text-gray-500">2020 - Present</div>
            <div className="text-gray-300">
              Led development of multiple full-stack applications using React and Node.js.
              Mentored junior developers and implemented best practices.
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -left-[1.65rem] md:-left-10 mt-2 w-3 h-3 bg-green-500 rounded-full" />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-green-400">Full Stack Developer</div>
            <div className="text-gray-400">Digital Solutions Ltd.</div>
            <div className="text-sm text-gray-500">2018 - 2020</div>
            <div className="text-gray-300">
              Developed and maintained client websites and applications.
              Worked with various technologies including React, Python, and PostgreSQL.
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[1.65rem] md:-left-10 mt-2 w-3 h-3 bg-purple-500 rounded-full" />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-purple-400">Junior Developer</div>
            <div className="text-gray-400">StartUp Ventures</div>
            <div className="text-sm text-gray-500">2016 - 2018</div>
            <div className="text-gray-300">
              Started as a junior developer working on frontend development.
              Gained experience with JavaScript, HTML, and CSS.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

