import { useState, useEffect } from "react";
import { AppointmentCard } from "@/components/AppointmentCard";
import { RescheduleModal } from "@/components/RescheduleModal";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import atendiLogo from "@/assets/123atendi-logo.png";
import { buscarConsulta, confirmarOuRemarcar, getTokenFromUrl, ConsultaData } from "@/services/api";

const Index = () => {
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [consultaData, setConsultaData] = useState<ConsultaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<'confirmed' | 'rescheduled' | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const token = getTokenFromUrl();

    if (!token) {
      setError('Link inválido. Token não encontrado.');
      setLoading(false);
      return;
    }

    try {
      const data = await buscarConsulta(token);

      if (data.sucesso) {
        setConsultaData(data);
        if (data.ja_confirmada) {
          setIsConfirmed(true);
        }
      } else {
        const errorMsg = data.erro || 'Não foi possível carregar os dados da consulta.';
        // Substituir mensagem de token expirado/utilizado
        const customMsg = errorMsg.toLowerCase().includes('token') &&
                         (errorMsg.toLowerCase().includes('utilizado') ||
                          errorMsg.toLowerCase().includes('expirado'))
          ? 'Esta consulta já foi confirmada ou reagendada. Em caso de dúvidas chame a clínica no Whatsapp.'
          : errorMsg;
        setError(customMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao carregar dados da consulta.';
      // Substituir mensagem de token expirado/utilizado
      const customMsg = errorMsg.toLowerCase().includes('token') &&
                       (errorMsg.toLowerCase().includes('utilizado') ||
                        errorMsg.toLowerCase().includes('expirado'))
        ? 'Esta consulta já foi confirmada ou reagendada. Em caso de dúvidas chame a clínica no Whatsapp.'
        : errorMsg;
      setError(customMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const token = getTokenFromUrl();
    if (!token) return;

    setProcessing(true);

    try {
      const response = await confirmarOuRemarcar(token, 'confirma');

      if (response.sucesso) {
        setIsConfirmed(true);
        setSuccessType('confirmed');
        toast({
          title: "Consulta confirmada!",
          description: response.mensagem,
        });

        setTimeout(() => {
          window.close();
        }, 4000);
      } else {
        toast({
          title: "Erro",
          description: response.erro || 'Erro ao confirmar consulta.',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || 'Erro ao processar solicitação.',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReschedule = async () => {
    const token = getTokenFromUrl();
    if (!token) return;

    setIsRescheduleModalOpen(false);
    setProcessing(true);

    try {
      const response = await confirmarOuRemarcar(token, 'remarca');

      if (response.sucesso) {
        setIsConfirmed(true);
        setSuccessType('rescheduled');
        toast({
          title: "Solicitação enviada",
          description: "Entraremos em contato pelo WhatsApp para realizar a remarcação.",
        });

        setTimeout(() => {
          window.close();
        }, 5000);
      } else {
        toast({
          title: "Erro",
          description: response.erro || 'Erro ao remarcar consulta.',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || 'Erro ao processar solicitação.',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Hero Header Premium */}
      <div className="relative w-full h-32 md:h-40 overflow-hidden bg-gradient-to-br from-[#e0f5f5] to-[#e2f2ea] shadow-sm">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-teal-100 rounded-full blur-2xl"></div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-2 z-10">
          <div className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#5EB561] tracking-tight drop-shadow-sm">
                Anna
              </h1>
              <span className="text-sm md:text-base font-light text-[#737373] opacity-90">
                Inteligência artificial para clínicas
              </span>
            </div>
          </div>
          <a
            href="https://anna.123atendi.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-all duration-300 hover:tracking-wide"
          >
            anna.123atendi.com.br
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 pt-6 overflow-y-auto">
        <div className="w-full max-w-md space-y-4">
          {/* Título */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Confirmação de Consulta
            </h2>
            <p className="text-sm text-muted-foreground">
              Revise os detalhes da sua consulta abaixo
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando dados...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-center space-y-1">
              <h3 className="font-semibold text-foreground">Atenção</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Success State - Data Loaded */}
          {!loading && !error && consultaData && (
            <>
              {/* Card de Informações */}
              <AppointmentCard
                clinicName={consultaData.empresa}
                patientName={consultaData.nome}
                date={consultaData.data}
                time={consultaData.hora}
              />

              {/* Botões de Ação */}
              {!isConfirmed ? (
                <div className="space-y-2">
                  <Button
                    onClick={handleConfirm}
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {processing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Confirmar Consulta
                  </Button>
                  <Button
                    onClick={() => setIsRescheduleModalOpen(true)}
                    disabled={processing}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Remarcar Consulta
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-success/10 border border-success rounded-lg text-center space-y-2">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 text-success-foreground" />
                  </div>
                  {successType === 'rescheduled' ? (
                    <>
                      <h3 className="font-semibold text-foreground">Solicitação enviada</h3>
                      <p className="text-sm text-muted-foreground">
                        Entraremos em contato pelo WhatsApp para realizar a remarcação.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-foreground">Obrigado!</h3>
                      <p className="text-sm text-muted-foreground">
                        Sua consulta foi confirmada com sucesso. Caso tenha dúvidas, entre em contato com a clínica.
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Powered by 123atendi */}
      <footer className="w-full py-3 border-t border-border/50">
        <div className="container mx-auto px-4 flex justify-center">
          <a
            href="https://anna.123atendi.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="text-xs text-muted-foreground">Powered by</span>
            <img
              src={atendiLogo}
              alt="123atendi"
              className="h-3.5 object-contain"
            />
          </a>
        </div>
      </footer>

      {/* Modal de Remarcar */}
      <RescheduleModal
        open={isRescheduleModalOpen}
        onOpenChange={setIsRescheduleModalOpen}
        onConfirm={handleReschedule}
      />
    </div>
  );
};

export default Index;
