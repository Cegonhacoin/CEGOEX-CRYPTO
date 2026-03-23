"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plane } from "lucide-react"

type GameState = "waiting" | "flying" | "crashed"
type HistoryItem = { multiplier: string; color: string }

export default function AviatorGame() {
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [multiplier, setMultiplier] = useState(1.0)
  const [cashedOut, setCashedOut] = useState(false)
  const [cashOutMultiplier, setCashOutMultiplier] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([
    { multiplier: "2.45x", color: "text-primary" },
    { multiplier: "1.23x", color: "text-muted-foreground" },
    { multiplier: "5.67x", color: "text-accent" },
    { multiplier: "1.89x", color: "text-primary" },
  ])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const crashPointRef = useRef<number>(2.0)

  const startGame = () => {
    setGameState("flying")
    setMultiplier(1.0)
    setCashedOut(false)
    setCashOutMultiplier(null)

    // Generate random crash point between 1.1x and 10x
    crashPointRef.current = Math.random() * 8.9 + 1.1

    let currentMultiplier = 1.0
    intervalRef.current = setInterval(() => {
      currentMultiplier += 0.01

      if (currentMultiplier >= crashPointRef.current) {
        endGame(currentMultiplier)
      } else {
        setMultiplier(Number(currentMultiplier.toFixed(2)))
      }
    }, 50)
  }

  const endGame = (finalMultiplier: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setGameState("crashed")

    // Add to history
    const newHistory = [...history]
    newHistory.unshift({
      multiplier: `${finalMultiplier.toFixed(2)}x`,
      color: finalMultiplier >= 2 ? "text-primary" : finalMultiplier >= 1.5 ? "text-accent" : "text-muted-foreground",
    })
    if (newHistory.length > 10) {
      newHistory.pop()
    }
    setHistory(newHistory)

    // Restart after 3 seconds
    setTimeout(() => {
      setGameState("waiting")
    }, 3000)
  }

  const handleCashOut = () => {
    if (gameState === "flying" && !cashedOut) {
      setCashedOut(true)
      setCashOutMultiplier(multiplier)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Plane className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Aviator Demo</h1>
        </div>
        <div className="text-sm text-muted-foreground">Educacional</div>
      </div>

      {/* Main Game Area */}
      <Card className="flex-1 relative overflow-hidden bg-card border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

        {/* Game Canvas */}
        <div className="relative h-full flex flex-col items-center justify-center p-6">
          {/* Multiplier Display */}
          <div className="relative z-10 mb-8">
            <div
              className={`text-6xl md:text-8xl font-bold transition-all duration-100 ${
                gameState === "flying"
                  ? "text-primary animate-pulse"
                  : gameState === "crashed"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {multiplier.toFixed(2)}x
            </div>
            {cashedOut && cashOutMultiplier && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-accent text-2xl font-bold animate-bounce">
                Resgatado! {cashOutMultiplier.toFixed(2)}x
              </div>
            )}
          </div>

          {/* Plane Animation */}
          {gameState === "flying" && (
            <div
              className="absolute bottom-10 left-10 animate-pulse"
              style={{
                animation: "plane-fly 10s linear forwards",
              }}
            >
              <Plane className="w-12 h-12 text-primary rotate-[-15deg]" />
            </div>
          )}

          {/* Status Messages */}
          {gameState === "waiting" && (
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-lg">Aguardando próximo voo...</p>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-8 py-6"
              >
                Iniciar Voo
              </Button>
            </div>
          )}

          {gameState === "crashed" && (
            <div className="text-center">
              <p className="text-destructive text-2xl font-bold">Voou embora!</p>
              <p className="text-muted-foreground mt-2">Próximo voo em breve...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Controls */}
      {gameState === "flying" && (
        <Button
          onClick={handleCashOut}
          disabled={cashedOut}
          size="lg"
          className={`w-full text-xl font-bold py-8 ${
            cashedOut
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-accent hover:bg-accent/90 text-accent-foreground"
          }`}
          style={!cashedOut ? { animation: "pulse-glow 2s infinite" } : undefined}
        >
          {cashedOut ? `Resgatado em ${cashOutMultiplier?.toFixed(2)}x` : "RESGATAR"}
        </Button>
      )}

      {/* History */}
      <Card className="bg-card border-border p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Histórico</h3>
        <div className="flex gap-2 flex-wrap">
          {history.map((item, index) => (
            <div key={index} className={`px-4 py-2 rounded-lg bg-secondary ${item.color} font-bold text-sm`}>
              {item.multiplier}
            </div>
          ))}
        </div>
      </Card>

      {/* Info Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Esta é uma demonstração educacional. Não envolve dinheiro real.</p>
      </div>
    </div>
  )
}
