import { DataPoint } from "./DataPoint";
import { EquipmentData } from "./EquipmentData";

export interface WorkerData { 
    equipmentData: EquipmentData, 
    flattenEquipmentData: DataPoint[],
    startIndex: number, 
    endIndex: number 
}