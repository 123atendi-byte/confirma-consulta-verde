// Configuração da API
const API_CONFIG = {
  baseURL: 'https://webhook.123atendi.com.br/webhook/api',
  auth: {
    username: '123confirmei',
    password: 'UqHFQQ8HHjLc'
  }
};

// Tipos TypeScript
export interface ConsultaData {
  sucesso: boolean;
  nome: string;
  data: string;
  hora: string;
  ja_confirmada: boolean;
  id_proxima_consulta: number;
  empresa: string;
  erro?: string;
}

export interface ConfirmacaoResponse {
  sucesso: boolean;
  mensagem: string;
  erro?: string;
}

// Função para criar o header de autenticação Basic Auth
const getAuthHeader = (): string => {
  const credentials = btoa(`${API_CONFIG.auth.username}:${API_CONFIG.auth.password}`);
  return `Basic ${credentials}`;
};

// Buscar dados da consulta
export const buscarConsulta = async (token: string): Promise<ConsultaData> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/confirmacao123?token=${token}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader()
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao buscar dados da consulta');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar consulta:', error);
    throw error;
  }
};

// Confirmar ou remarcar consulta
export const confirmarOuRemarcar = async (token: string, acao: 'confirma' | 'remarca'): Promise<ConfirmacaoResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/confirmaounao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        token,
        acao
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao processar solicitação');
    }

    return data;
  } catch (error) {
    console.error('Erro ao confirmar/remarcar:', error);
    throw error;
  }
};

// Extrair token da URL
export const getTokenFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
};
