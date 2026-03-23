import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Lock, Download, Save, AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4 bg-transparent">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Gerador
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">CegoEx Crypto</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Guia completo sobre como usar o gerador de carteiras de criptomoedas
          </p>
        </div>

        {/* O que é */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">O que é o CegoEx Crypto?</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            O CegoEx Crypto é um gerador de carteiras de criptomoedas que permite criar endereços e chaves para
            múltiplas redes blockchain. Uma carteira de criptomoedas consiste em um par de chaves criptográficas: uma
            chave pública (endereço) para receber fundos e uma chave privada para acessar e movimentar os fundos.
          </p>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Redes Suportadas:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>• Bitcoin (BTC)</div>
              <div>• Ethereum (ETH)</div>
              <div>• BNB Smart Chain</div>
              <div>• Polygon (MATIC)</div>
              <div>• Solana (SOL)</div>
              <div>• Avalanche (AVAX)</div>
              <div>• Cardano (ADA)</div>
              <div>• Polkadot (DOT)</div>
              <div>• Ripple (XRP)</div>
              <div>• Litecoin (LTC)</div>
            </div>
          </div>
        </Card>

        {/* Como usar */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Como Usar</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  1
                </span>
                Selecione a Rede
              </h3>
              <p className="text-muted-foreground ml-8">
                Clique em uma das 10 redes blockchain disponíveis. Cada rede tem suas próprias características e casos
                de uso.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  2
                </span>
                Aguarde a Geração
              </h3>
              <p className="text-muted-foreground ml-8">
                O sistema irá gerar automaticamente uma nova carteira com endereço, chaves e frase mnemônica.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  3
                </span>
                Salve as Informações
              </h3>
              <p className="text-muted-foreground ml-8">
                Use o botão Download PDF para baixar todas as informações da carteira em um arquivo seguro. Você também
                pode copiar cada campo individualmente.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  4
                </span>
                (Opcional) Crie uma Conta
              </h3>
              <p className="text-muted-foreground ml-8">
                Faça login para salvar suas carteiras no navegador e acessá-las depois. As carteiras são armazenadas
                localmente no seu dispositivo.
              </p>
            </div>
          </div>
        </Card>

        {/* Componentes da Carteira */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Componentes da Carteira</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Endereço Público</h3>
              <p className="text-sm text-muted-foreground">
                É como o número da sua conta bancária. Você pode compartilhar livremente para receber criptomoedas.
              </p>
            </div>

            <div className="border-l-4 border-destructive pl-4">
              <h3 className="font-semibold mb-1 text-destructive">Chave Privada</h3>
              <p className="text-sm text-muted-foreground">
                É como a senha da sua conta. NUNCA compartilhe! Quem tiver acesso pode controlar todos os fundos.
              </p>
            </div>

            <div className="border-l-4 border-destructive pl-4">
              <h3 className="font-semibold mb-1 text-destructive">Frase Mnemônica</h3>
              <p className="text-sm text-muted-foreground">
                12 palavras que permitem recuperar sua carteira. Mantenha em local extremamente seguro, de preferência
                offline.
              </p>
            </div>

            <div className="border-l-4 border-muted pl-4">
              <h3 className="font-semibold mb-1">Chave Pública</h3>
              <p className="text-sm text-muted-foreground">
                Versão matemática do endereço público. Usada internamente pelo protocolo blockchain.
              </p>
            </div>
          </div>
        </Card>

        {/* Funcionalidades */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Save className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Funcionalidades</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Download em PDF</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                Baixe todas as informações da carteira em um arquivo PDF formatado com avisos de segurança inclusos.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Sistema de Login</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                Crie uma conta com usuário e senha (mínimo 6 caracteres) para salvar múltiplas carteiras no navegador.
                Todas as informações são armazenadas localmente no seu dispositivo.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Save className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Salvar Carteiras</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                Quando logado, use o botão Salvar para armazenar carteiras. Acesse todas suas carteiras salvas pelo
                botão Carteiras no topo da página.
              </p>
            </div>
          </div>
        </Card>

        {/* Segurança */}
        <Card className="p-6 mb-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-destructive" />
            <h2 className="text-2xl font-bold text-destructive">Segurança Crítica</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <strong>NUNCA compartilhe sua chave privada ou frase mnemônica.</strong> Quem tiver acesso pode roubar
                todos os seus fundos.
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <strong>Guarde em local extremamente seguro.</strong> Considere usar cofre físico, caixa de segurança
                bancária ou cold storage.
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <strong>Faça múltiplos backups.</strong> Se perder acesso, não há como recuperar. Não existe suporte ou
                recuperação de senha em blockchain.
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <strong>Nunca digite sua chave privada em sites desconhecidos.</strong> Golpistas podem criar sites
                falsos para roubar suas informações.
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <strong>Use carteiras de hardware para grandes valores.</strong> Ledger, Trezor e similares oferecem
                segurança adicional com armazenamento offline.
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Este gerador é seguro?</h3>
              <p className="text-sm text-muted-foreground">
                Este é um gerador de demonstração educacional. Para uso real com valores significativos, recomendamos
                usar carteiras de hardware (Ledger, Trezor) ou carteiras oficiais das próprias redes blockchain.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">As carteiras são armazenadas online?</h3>
              <p className="text-sm text-muted-foreground">
                Não. Todas as carteiras salvas ficam armazenadas localmente no navegador do seu dispositivo. Nada é
                enviado para servidores externos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Posso recuperar minha senha se esquecer?</h3>
              <p className="text-sm text-muted-foreground">
                Não. O sistema de login é local e não há recuperação de senha. Certifique-se de lembrar suas credenciais
                ou salvar o PDF das carteiras.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Posso usar a mesma carteira em diferentes redes?</h3>
              <p className="text-sm text-muted-foreground">
                Algumas redes compatíveis com EVM (Ethereum, BSC, Polygon, Avalanche) podem compartilhar o mesmo
                endereço, mas cada rede é independente. Sempre gere carteiras específicas para cada rede.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">O que fazer se perder a chave privada?</h3>
              <p className="text-sm text-muted-foreground">
                Infelizmente, não há nada que possa ser feito. O acesso aos fundos será perdido permanentemente. Por
                isso é crucial fazer backups seguros das informações da carteira.
              </p>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="p-6 bg-muted/30">
          <h2 className="text-xl font-bold mb-3">Aviso Legal</h2>
          <p className="text-sm text-muted-foreground">
            Este gerador é fornecido para fins educacionais e de demonstração. Os desenvolvedores não se responsabilizam
            por perda de fundos, uso inadequado ou qualquer problema relacionado ao uso desta ferramenta. Sempre faça
            sua própria pesquisa (DYOR) e use carteiras oficiais e auditadas para guardar valores significativos. A
            segurança dos seus ativos é sua responsabilidade.
          </p>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Gerador
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
