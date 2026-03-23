"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, Check, Wallet, Clock, TrendingUp, ArrowLeft } from "lucide-react"

interface WalletData {
  network: string
  address: string
  privateKey: string
  mnemonic: string
  publicKey: string
  savedAt?: string
}

interface Transaction {
  id: string
  type: "send" | "receive"
  amount: number
  token: string
  address: string
  timestamp: string
  status: "completed" | "pending"
}

interface WalletBalance {
  [key: string]: number
}

export default function WalletDashboard() {
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null)
  const [savedWallets, setSavedWallets] = useState<WalletData[]>([])
  const [balances, setBalances] = useState<WalletBalance>({})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const session = localStorage.getItem("crypto_session")
    if (session) {
      const { username: savedUser } = JSON.parse(session)
      setUsername(savedUser)
      setIsLoggedIn(true)
      loadWalletData(savedUser)
    }
  }, [])

  const loadWalletData = (user: string) => {
    const allWallets = JSON.parse(localStorage.getItem("crypto_wallets") || "{}")
    const userWallets = allWallets[user] || []
    setSavedWallets(userWallets)

    if (userWallets.length > 0) {
      setSelectedWallet(userWallets[0])
      loadBalances(user, userWallets[0].address)
      loadTransactions(user, userWallets[0].address)
    }
  }

  const loadBalances = (user: string, address: string) => {
    const key = `balances_${user}_${address}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setBalances(JSON.parse(saved))
    } else {
      const initialBalances: WalletBalance = {
        BTC: 0.0,
        ETH: 0.0,
        BNB: 0.0,
        MATIC: 0.0,
        SOL: 0.0,
        AVAX: 0.0,
        ADA: 0.0,
        DOT: 0.0,
        XRP: 0.0,
        LTC: 0.0,
      }
      setBalances(initialBalances)
      localStorage.setItem(key, JSON.stringify(initialBalances))
    }
  }

  const loadTransactions = (user: string, address: string) => {
    const key = `transactions_${user}_${address}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setTransactions(JSON.parse(saved))
    } else {
      setTransactions([])
    }
  }

  const saveBalances = (newBalances: WalletBalance) => {
    if (!selectedWallet) return
    const key = `balances_${username}_${selectedWallet.address}`
    localStorage.setItem(key, JSON.stringify(newBalances))
    setBalances(newBalances)
  }

  const saveTransaction = (transaction: Transaction) => {
    if (!selectedWallet) return
    const key = `transactions_${username}_${selectedWallet.address}`
    const updated = [transaction, ...transactions]
    localStorage.setItem(key, JSON.stringify(updated))
    setTransactions(updated)
  }

  const handleSendTokens = () => {
    if (!selectedWallet || !sendAmount || !sendAddress) return

    const amount = Number.parseFloat(sendAmount)
    const token = getTokenFromNetwork(selectedWallet.network)

    if (amount <= 0 || amount > (balances[token] || 0)) {
      alert("Saldo insuficiente ou valor inválido")
      return
    }

    const newBalances = { ...balances, [token]: (balances[token] || 0) - amount }
    saveBalances(newBalances)

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: "send",
      amount,
      token,
      address: sendAddress,
      timestamp: new Date().toISOString(),
      status: "completed",
    }
    saveTransaction(transaction)

    setSendAmount("")
    setSendAddress("")
    setShowSendModal(false)
  }

  const handleReceiveTokens = (amount: number) => {
    if (!selectedWallet || amount <= 0) return

    const token = getTokenFromNetwork(selectedWallet.network)
    const newBalances = { ...balances, [token]: (balances[token] || 0) + amount }
    saveBalances(newBalances)

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: "receive",
      amount,
      token,
      address: selectedWallet.address,
      timestamp: new Date().toISOString(),
      status: "completed",
    }
    saveTransaction(transaction)
  }

  const getTokenFromNetwork = (network: string): string => {
    const tokenMap: { [key: string]: string } = {
      "Bitcoin (BTC)": "BTC",
      "Ethereum (ETH)": "ETH",
      "BNB Smart Chain (BSC)": "BNB",
      "Polygon (MATIC)": "MATIC",
      "Solana (SOL)": "SOL",
      "Avalanche (AVAX)": "AVAX",
      "Cardano (ADA)": "ADA",
      "Polkadot (DOT)": "DOT",
      "Ripple (XRP)": "XRP",
      "Litecoin (LTC)": "LTC",
    }
    return tokenMap[network] || "TOKEN"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Painel de Tokens</h2>
          <p className="text-muted-foreground mb-6">Faça login para gerenciar suas carteiras e tokens</p>
          <Button onClick={() => (window.location.href = "/")} size="lg" className="w-full">
            Ir para Login
          </Button>
        </Card>
      </div>
    )
  }

  if (savedWallets.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Nenhuma Carteira</h2>
          <p className="text-muted-foreground mb-6">Você ainda não tem carteiras salvas. Crie uma carteira primeiro.</p>
          <Button onClick={() => (window.location.href = "/")} size="lg" className="w-full">
            Criar Carteira
          </Button>
        </Card>
      </div>
    )
  }

  const currentToken = selectedWallet ? getTokenFromNetwork(selectedWallet.network) : ""
  const currentBalance = balances[currentToken] || 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => (window.location.href = "/")} variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Painel de Tokens</h1>
              <p className="text-sm text-muted-foreground mt-1">Gerencie seus tokens e transações</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Wallet Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Minhas Carteiras
            </h2>
            <div className="space-y-2">
              {savedWallets.map((wallet, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedWallet(wallet)
                    loadBalances(username, wallet.address)
                    loadTransactions(username, wallet.address)
                  }}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedWallet?.address === wallet.address
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{wallet.network}</div>
                  <div className="font-mono text-xs text-muted-foreground truncate">{wallet.address}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Total</p>
                <h2 className="text-4xl font-bold">
                  {currentBalance.toFixed(6)} {currentToken}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowSendModal(true)} className="flex-1" size="lg">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Enviar
              </Button>
              <Button onClick={() => setShowReceiveModal(true)} variant="outline" className="flex-1" size="lg">
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Receber
              </Button>
            </div>
          </Card>

          {/* Transaction History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Transações
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectedWallet && loadTransactions(username, selectedWallet.address)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma transação ainda</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === "send" ? "bg-destructive/10" : "bg-primary/10"}`}>
                        {tx.type === "send" ? (
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.type === "send" ? "Enviado" : "Recebido"}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tx.address.substring(0, 16)}...</p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === "send" ? "text-destructive" : "text-primary"}`}>
                        {tx.type === "send" ? "-" : "+"}
                        {tx.amount.toFixed(6)} {tx.token}
                      </p>
                      <span className="text-xs text-muted-foreground">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-card p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Enviar {currentToken}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Endereço de Destino</label>
                <Input
                  type="text"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="0x..."
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Quantidade</label>
                <Input
                  type="number"
                  step="0.000001"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Disponível: {currentBalance.toFixed(6)} {currentToken}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSendTokens} className="flex-1" size="lg">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
                <Button
                  onClick={() => {
                    setShowSendModal(false)
                    setSendAmount("")
                    setSendAddress("")
                  }}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-card p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Receber {currentToken}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Seu Endereço</label>
                <div className="flex gap-2">
                  <div className="bg-secondary/50 rounded-lg p-3 font-mono text-sm break-all flex-1">
                    {selectedWallet.address}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(selectedWallet.address)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">Simular recebimento de tokens (Demo):</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleReceiveTokens(0.1)} variant="outline" size="sm" className="flex-1">
                    +0.1 {currentToken}
                  </Button>
                  <Button onClick={() => handleReceiveTokens(1)} variant="outline" size="sm" className="flex-1">
                    +1 {currentToken}
                  </Button>
                  <Button onClick={() => handleReceiveTokens(10)} variant="outline" size="sm" className="flex-1">
                    +10 {currentToken}
                  </Button>
                </div>
              </div>

              <Button onClick={() => setShowReceiveModal(false)} variant="outline" className="w-full" size="lg">
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
