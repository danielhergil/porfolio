"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, Coffee, Server, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const stages = ["Build", "Test", "Deploy", "Launch"]

interface PipelineStage {
  name: string
  status: "idle" | "running" | "success" | "failure"
  icon: React.ReactNode
}

const initialStages: PipelineStage[] = [
  { name: "Build", status: "idle", icon: <Rocket className="w-6 h-6" /> },
  { name: "Test", status: "idle", icon: <Coffee className="w-6 h-6" /> },
  { name: "Deploy", status: "idle", icon: <Server className="w-6 h-6" /> },
  { name: "Launch", status: "idle", icon: <Zap className="w-6 h-6" /> },
]

export default function CICDPipeline() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>(initialStages)
  const [currentStage, setCurrentStage] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [userName, setUserName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [progress, setProgress] = useState(0)

  const runPipeline = () => {
    if (!userName || !projectName) {
      alert("Please enter both your name and project name before running the pipeline.")
      return
    }
    setIsRunning(true)
    setPipeline(initialStages)
    setCurrentStage(0)
    setDeploymentUrl("")
    setProgress(0)
  }

  useEffect(() => {
    if (isRunning && currentStage < stages.length) {
      const timer = setTimeout(() => {
        setPipeline((prev) => {
          const newPipeline = [...prev]
          newPipeline[currentStage].status = Math.random() > 0.1 ? "success" : "failure"
          return newPipeline
        })

        setProgress((currentStage + 1) * (100 / stages.length))

        if (currentStage === stages.length - 1) {
          setIsRunning(false)
          const success = pipeline.every((stage) => stage.status === "success")
          if (success) {
            const timestamp = new Date().getTime()
            setDeploymentUrl(
              `https://${userName.toLowerCase().replace(/\s+/g, "-")}-${projectName.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.vercel.app`,
            )
          }
        } else {
          setCurrentStage((prev) => prev + 1)
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isRunning, currentStage, pipeline, userName, projectName])

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">CI/CD Pipeline Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-[#2d2d2d] text-white border-gray-600"
        />
        <Input
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-[#2d2d2d] text-white border-gray-600"
        />
      </div>
      <div className="relative pt-1">
        <Progress value={progress} className="w-full h-2" />
      </div>
      <div className="flex justify-center items-center gap-8">
        {pipeline.map((stage, index) => (
          <div key={stage.name} className="flex flex-col items-center">
            <motion.div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                stage.status === "success"
                  ? "bg-green-500"
                  : stage.status === "failure"
                    ? "bg-red-500"
                    : currentStage === index && isRunning
                      ? "bg-blue-500"
                      : "bg-gray-700"
              }`}
              animate={{
                scale: currentStage === index && isRunning ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: currentStage === index && isRunning ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              {stage.icon}
            </motion.div>
            <span className="mt-2 text-sm">{stage.name}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button onClick={runPipeline} disabled={isRunning || !userName || !projectName}>
          {isRunning ? "Deploying..." : "Start Deployment"}
        </Button>
      </div>
      <AnimatePresence>
        {deploymentUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mt-8 p-4 bg-[#2d2d2d] rounded-lg"
          >
            <p className="text-green-400 mb-2">Deployment Successful!</p>
            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              View your project: {deploymentUrl}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

