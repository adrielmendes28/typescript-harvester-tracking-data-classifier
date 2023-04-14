import { EquipmentStatusEnum } from "./EquipmentStatus"

export interface DataPoint {
    id: string;
    deveui: string;
    frota: string;
    op: string;
    stid: string;
    status: EquipmentStatusEnum;
    paired: string | null;
    categoria: string;
    operacao: string;
    Frente: string;
    tst: number;
    tsd: string;
    lat: number;
    lon: number;
    head: number;
    speed: number;
    rssi: number;
    snr: number;
    sf: number;
}
