import { DataPoint } from "./DataPoint";

export interface EquipmentData {
    [equipmentId: string]: DataPoint[];
}
