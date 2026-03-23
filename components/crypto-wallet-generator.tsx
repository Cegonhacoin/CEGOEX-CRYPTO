"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wallet, Download, Copy, Check, Save, LogIn, Eye, EyeOff, BookOpen } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"

interface WalletData {
  network: string
  address: string
  privateKey: string
  mnemonic: string
  publicKey: string
  savedAt?: string
}

interface SavedWallets {
  [key: string]: WalletData[]
}

const NETWORKS = [
  { id: "bitcoin", name: "Bitcoin (BTC)", icon: "₿" },
  { id: "ethereum", name: "Ethereum (ETH)", icon: "Ξ" },
  { id: "binance", name: "BNB Smart Chain (BSC)", icon: "B" },
  { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
  { id: "solana", name: "Solana (SOL)", icon: "◎" },
  { id: "avalanche", name: "Avalanche (AVAX)", icon: "A" },
  { id: "cardano", name: "Cardano (ADA)", icon: "₳" },
  { id: "polkadot", name: "Polkadot (DOT)", icon: "●" },
  { id: "ripple", name: "Ripple (XRP)", icon: "X" },
  { id: "litecoin", name: "Litecoin (LTC)", icon: "Ł" },
]

export default function CryptoWalletGenerator() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("")
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [copied, setCopied] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [savedWallets, setSavedWallets] = useState<WalletData[]>([])
  const [showSavedWallets, setShowSavedWallets] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("crypto_session")
    if (session) {
      const { username: savedUser } = JSON.parse(session)
      setUsername(savedUser)
      setIsLoggedIn(true)
      loadSavedWallets(savedUser)
    }
  }, [])

  const loadSavedWallets = (user: string) => {
    const allWallets: SavedWallets = JSON.parse(localStorage.getItem("crypto_wallets") || "{}")
    setSavedWallets(allWallets[user] || [])
  }

  const handleLogin = () => {
    if (!username || !password) {
      setLoginError("Preencha todos os campos")
      return
    }
    if (password.length < 6) {
      setLoginError("Senha deve ter no mínimo 6 caracteres")
      return
    }

    const users = JSON.parse(localStorage.getItem("crypto_users") || "{}")

    if (users[username]) {
      if (users[username] === password) {
        setIsLoggedIn(true)
        setShowLoginModal(false)
        setLoginError("")
        localStorage.setItem("crypto_session", JSON.stringify({ username }))
        loadSavedWallets(username)
      } else {
        setLoginError("Senha incorreta")
      }
    } else {
      users[username] = password
      localStorage.setItem("crypto_users", JSON.stringify(users))
      setIsLoggedIn(true)
      setShowLoginModal(false)
      setLoginError("")
      localStorage.setItem("crypto_session", JSON.stringify({ username }))
      loadSavedWallets(username)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
    setSavedWallets([])
    localStorage.removeItem("crypto_session")
  }

  const saveWallet = () => {
    if (!wallet || !isLoggedIn) return

    const allWallets: SavedWallets = JSON.parse(localStorage.getItem("crypto_wallets") || "{}")
    const userWallets = allWallets[username] || []

    const walletWithTimestamp = { ...wallet, savedAt: new Date().toISOString() }
    userWallets.push(walletWithTimestamp)
    allWallets[username] = userWallets

    localStorage.setItem("crypto_wallets", JSON.stringify(allWallets))
    setSavedWallets(userWallets)
  }

  const generateWallet = (networkId: string) => {
    setIsGenerating(true)
    setSelectedNetwork(networkId)

    setTimeout(() => {
      const network = NETWORKS.find((n) => n.id === networkId)
      const mockWallet: WalletData = {
        network: network?.name || "",
        address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        privateKey: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        mnemonic: Array.from(
          { length: 12 },
          (_, i) =>
            [
              "abandon",
              "ability",
              "able",
              "about",
              "above",
              "absent",
              "absorb",
              "abstract",
              "absurd",
              "abuse",
              "access",
              "accident",
            ][i],
        ).join(" "),
        publicKey: `0x${Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      }
      setWallet(mockWallet)
      setIsGenerating(false)
    }, 800)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(""), 2000)
  }

  const downloadWalletPDF = () => {
    if (!wallet) return

    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    let y = 20

    pdf.setFontSize(20)
    pdf.setTextColor(220, 38, 38)
    pdf.text("CegoEx Crypto - CARTEIRA CRIPTOGRAFICA", pageWidth / 2, y, { align: "center" })

    y += 10
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text(wallet.network, pageWidth / 2, y, { align: "center" })

    y += 15
    pdf.setFontSize(10)
    pdf.setTextColor(220, 38, 38)
    pdf.text("MANTENHA ESTA INFORMACAO SEGURA E PRIVADA", pageWidth / 2, y, { align: "center" })

    y += 15
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)

    pdf.setFont(undefined, "bold")
    pdf.text("Endereco Publico:", 20, y)
    y += 7
    pdf.setFont(undefined, "normal")
    pdf.setFontSize(9)
    const addressLines = pdf.splitTextToSize(wallet.address, pageWidth - 40)
    pdf.text(addressLines, 20, y)
    y += addressLines.length * 5 + 10

    pdf.setFontSize(11)
    pdf.setFont(undefined, "bold")
    pdf.setTextColor(220, 38, 38)
    pdf.text("Chave Privada (MANTENHA SEGURA!):", 20, y)
    y += 7
    pdf.setFont(undefined, "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(0, 0, 0)
    const privateKeyLines = pdf.splitTextToSize(wallet.privateKey, pageWidth - 40)
    pdf.text(privateKeyLines, 20, y)
    y += privateKeyLines.length * 5 + 10

    pdf.setFontSize(11)
    pdf.setFont(undefined, "bold")
    pdf.setTextColor(220, 38, 38)
    pdf.text("Frase Mnemonica (12 Palavras):", 20, y)
    y += 7
    pdf.setFont(undefined, "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(0, 0, 0)
    const mnemonicLines = pdf.splitTextToSize(wallet.mnemonic, pageWidth - 40)
    pdf.text(mnemonicLines, 20, y)
    y += mnemonicLines.length * 5 + 10

    pdf.setFontSize(11)
    pdf.setFont(undefined, "bold")
    pdf.setTextColor(220, 38, 38)
    pdf.text("Chave Publica:", 20, y)
    y += 7
    pdf.setFont(undefined, "normal")
    pdf.setFontSize(9)
    const publicKeyLines = pdf.splitTextToSize(wallet.publicKey, pageWidth - 40)
    pdf.text(publicKeyLines, 20, y)
    y += publicKeyLines.length * 5 + 15

    pdf.setFontSize(10)
    pdf.setTextColor(220, 38, 38)
    pdf.setFont(undefined, "bold")
    pdf.text("AVISOS DE SEGURANCA:", 20, y)
    y += 7
    pdf.setFontSize(8)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont(undefined, "normal")
    const warnings = [
      "- NUNCA compartilhe sua chave privada ou frase mnemonica",
      "- Guarde este arquivo em um local EXTREMAMENTE seguro",
      "- Faca multiplos backups em locais diferentes",
      "- Considere usar armazenamento offline (cold storage)",
      "- Perder esta informacao = perder acesso aos fundos PERMANENTEMENTE",
    ]
    warnings.forEach((warning) => {
      pdf.text(warning, 20, y)
      y += 5
    })

    y += 10
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Gerado em: ${new Date().toLocaleString("pt-BR")} via CegoEx Crypto`, 20, y)

    pdf.save(`cegoex-wallet-${wallet.network.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">CegoEx Crypto</h1>
              <p className="text-sm text-muted-foreground mt-1">Gerador de Carteiras Blockchain</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="default" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Painel
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Docs
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Button onClick={() => setShowSavedWallets(!showSavedWallets)} variant="outline" size="sm">
                  <Wallet className="h-4 w-4 mr-2" />
                  Minhas ({savedWallets.length})
                </Button>
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  Sair
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowLoginModal(true)} size="sm" className="min-w-[100px]">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-card p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo ao CegoEx</h2>
            <p className="text-sm text-muted-foreground mb-6">Entre ou crie uma nova conta</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Usuário</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {loginError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-destructive text-sm">{loginError}</p>
                </div>
              )}
              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={handleLogin} className="w-full" size="lg">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar / Criar Conta
                </Button>
                <Button
                  onClick={() => {
                    setShowLoginModal(false)
                    setLoginError("")
                    setUsername("")
                    setPassword("")
                    setShowPassword(false)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Se o usuário não existir, uma nova conta será criada automaticamente
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Saved Wallets Modal */}
      {showSavedWallets && isLoggedIn && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="bg-card p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Minhas Carteiras Salvas</h2>
              <Button onClick={() => setShowSavedWallets(false)} variant="outline" size="sm">
                Fechar
              </Button>
            </div>
            {savedWallets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma carteira salva ainda</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {savedWallets.map((w, idx) => (
                  <Card key={idx} className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{w.network}</h3>
                      <span className="text-xs text-muted-foreground">
                        {w.savedAt && new Date(w.savedAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground break-all mb-3">{w.address}</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setWallet(w)
                        setShowSavedWallets(false)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Ver Detalhes
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Network Selection */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Selecione a Rede</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              onClick={() => generateWallet(network.id)}
              disabled={isGenerating}
              className={`
                relative p-6 rounded-lg border-2 transition-all
                ${
                  selectedNetwork === network.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                }
                ${isGenerating ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
              `}
            >
              <div className="text-4xl mb-2">{network.icon}</div>
              <div className="text-sm font-medium">{network.name}</div>
              {isGenerating && selectedNetwork === network.id && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Display */}
      {wallet && (
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-2xl font-bold">Carteira Gerada</h3>
              <div className="flex gap-2 flex-wrap">
                {isLoggedIn && (
                  <Button onClick={saveWallet} variant="outline" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                )}
                <Button onClick={downloadWalletPDF} size="lg" className="min-w-[140px]">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Rede</label>
                <div className="bg-secondary/50 rounded-lg p-3 font-mono">{wallet.network}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Endereço Público</label>
                <div className="flex gap-2">
                  <div className="bg-secondary/50 rounded-lg p-3 font-mono text-sm break-all flex-1">
                    {wallet.address}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(wallet.address, "address")}>
                    {copied === "address" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-destructive mb-2 block">Chave Privada (SEGREDO!)</label>
                <div className="flex gap-2">
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 font-mono text-sm break-all flex-1">
                    {wallet.privateKey}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(wallet.privateKey, "private")}>
                    {copied === "private" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-destructive mb-2 block">Frase Mnemônica (12 Palavras)</label>
                <div className="flex gap-2">
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 font-mono text-sm break-all flex-1">
                    {wallet.mnemonic}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(wallet.mnemonic, "mnemonic")}>
                    {copied === "mnemonic" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Chave Pública</label>
                <div className="flex gap-2">
                  <div className="bg-secondary/50 rounded-lg p-3 font-mono text-sm break-all flex-1">
                    {wallet.publicKey}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(wallet.publicKey, "public")}>
                    {copied === "public" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Card className="bg-destructive/10 border-destructive/30 p-4">
                <h4 className="font-bold text-destructive mb-2">Avisos de Segurança</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• NUNCA compartilhe sua chave privada ou frase mnemônica</li>
                  <li>• Guarde em local extremamente seguro</li>
                  <li>• Faça múltiplos backups</li>
                  <li>• Considere cold storage para grandes valores</li>
                  <li>• Perder estas informações = perder acesso permanentemente</li>
                </ul>
              </Card>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
