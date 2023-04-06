export interface DataPoint {
    id: string; // Um identificador único para cada objeto.
    deveui: string; // Identificador único do dispositivo associado ao equipamento.
    frota: string; // Número da frota a que o equipamento pertence.
    op: string; // Código da operação.
    stid: string; // Identificador único do equipamento.
    status: string; // Status do equipamento.
    categoria: string; // Categoria do equipamento (exemplo: COLH para colheitadeira, PLAN para plantadeira, TRBD para trator).
    operacao: string; // Operação na qual o equipamento está envolvido (neste caso, "PLANTIO CANA").
    Frente: string; // Frente de trabalho à qual o equipamento está associado.
    tst: number; // Timestamp Unix referente à data e hora da coleta dos dados.
    tsd: string; // Data e hora no formato ISO 8601 referente à coleta dos dados.
    lat: number; // Latitude da localização do equipamento.
    lon: number; // Longitude da localização do equipamento.
    head: number; // Direção em que o equipamento está apontando, em graus.
    speed: number; // Velocidade do equipamento em km/h.
    rssi: number; // Intensidade do sinal recebido (RSSI - Received Signal Strength Indicator) em dBm.
    snr: number; // Relação sinal-ruído (SNR - Signal-to-Noise Ratio) em dB.
    sf: number; // Fator de espalhamento (SF - Spreading Factor), que indica a taxa de dados LoRaWAN.
}
