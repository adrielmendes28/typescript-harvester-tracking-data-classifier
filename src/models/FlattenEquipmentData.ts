import { DataPoint } from "./DataPoint";

export interface FlattenEquipmentData { //algo igualmente performático pode ser feito no SQL, criando um índice contendo frota + timestamp por registro
    [timestamp: number]: {
        [equipmentId: string]: DataPoint;
    };
}
