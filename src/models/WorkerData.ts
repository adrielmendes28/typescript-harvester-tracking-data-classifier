import { DataPoint } from "./DataPoint";
import { EquipmentData } from "./EquipmentData";
import { FlattenEquipmentData } from "./FlattenEquipmentData";

export interface WorkerData { 
    equipmentData: EquipmentData, 
    flattenEquipmentData: FlattenEquipmentData,
    startIndex: number, 
    endIndex: number 
}
