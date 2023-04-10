export interface EquipmentStatus {
    id?: string;
    status: EquipmentStatusEnum;
    paired: string | null;
}

export enum EquipmentStatusEnum {
    MOVING = 'Em movimento',
    STOPPED = 'Parado',
    MANEUVERING = 'Em manobra',
    HARVESTING = 'Em colheita',
}
