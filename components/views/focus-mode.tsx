"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings } from "lucide-react"

export function FocusMode() {
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      if (soundEnabled) {
        playSound()
      }

      if (sessionType === "focus") {
        setSessionsCompleted((s) => s + 1)
        setSessionType("break")
        setTimeLeft(breakTime * 60)
      } else {
        setSessionType("focus")
        setTimeLeft(focusTime * 60)
      }
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, sessionType, soundEnabled, focusTime, breakTime])

  const playSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetSession = () => {
    setIsRunning(false)
    setTimeLeft(sessionType === "focus" ? focusTime * 60 : breakTime * 60)
  }

  const progress =
    sessionType === "focus"
      ? ((focusTime * 60 - timeLeft) / (focusTime * 60)) * 100
      : ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100

  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full">
        <Card className="p-12 text-center">
          {/* Session Type */}
          <div className="mb-8">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                sessionType === "focus"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {sessionType === "focus" ? "🎯 Focus Time" : "☕ Break Time"}
            </span>
          </div>

          {/* Timer Display */}
          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(progress / 100) * 552} 552`}
                  className={`text-${sessionType === "focus" ? "blue" : "green"}-500 transition-all`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {sessionType === "focus" ? "Focus" : "Break"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => setIsRunning(!isRunning)} className="gap-2">
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={resetSession} className="gap-2 bg-transparent">
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          {/* Settings */}
          {!showSettings ? (
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center gap-2 w-full p-2 rounded hover:bg-muted transition-colors mb-4"
            >
              <Settings className="w-4 h-4" />
              Timer Settings
            </button>
          ) : (
            <div className="mb-4 p-4 bg-muted rounded-lg space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Focus Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={focusTime}
                  onChange={(e) => {
                    setFocusTime(Number.parseInt(e.target.value))
                    if (sessionType === "focus") setTimeLeft(Number.parseInt(e.target.value) * 60)
                  }}
                  className="w-full p-2 border border-border rounded bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Break Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={breakTime}
                  onChange={(e) => {
                    setBreakTime(Number.parseInt(e.target.value))
                    if (sessionType === "break") setTimeLeft(Number.parseInt(e.target.value) * 60)
                  }}
                  className="w-full p-2 border border-border rounded bg-background text-foreground"
                />
              </div>
              <Button onClick={() => setShowSettings(false)} size="sm" className="w-full">
                Done
              </Button>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center justify-center gap-2 w-full p-2 rounded hover:bg-muted transition-colors mb-4"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                Sound On
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                Sound Off
              </>
            )}
          </button>

          {/* Sessions Completed */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Sessions Completed Today</p>
            <p className="text-3xl font-bold">{sessionsCompleted}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
