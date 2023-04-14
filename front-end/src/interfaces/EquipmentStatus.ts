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
    TRANSBORDING_TO_PLANTER = 'Transbordando na plantadeira',
    FILLING_LOAD = "Enchendo a carga",
    REFUELING = "Abastecendo",
    BEING_REFUELED = "Sendo abastecida",
}
