import { DataPoint } from "../models/DataPoint";

class ManeuveringService {
    /**
     * Verifica se o maquinário está realizando uma manobra com base na variação do ângulo entre pontos consecutivos.
     * @param {DataPoint[]} data Um array de pontos de dados com latitude, longitude, timestamp, head e equipmentType.
     * @returns {boolean} Retorna true se o maquinário estiver realizando uma manobra e false caso contrário.
     */
    public isManeuvering(data: DataPoint[]): boolean {
        for (let i = 1; i < data.length; i++) {
            const prevPoint = data[i - 1];
            const currentPoint = data[i];

            // Determine o ângulo de limite com base no tipo de equipamento
            const angleThreshold = this.getAngleThresholdForEquipmentType(currentPoint.categoria);

            // Calcule a variação do ângulo entre os pontos consecutivos
            const angleDifference = Math.abs(currentPoint.head - prevPoint.head);

            // Se a variação do ângulo for maior que o limite, o maquinário está realizando uma manobra
            if (angleDifference > angleThreshold) {
                return true;
            }
        }

        return false;
    }

    /**
     * Retorna o ângulo de limite apropriado para o tipo de equipamento especificado.
     * @param {string} equipmentType O tipo de equipamento.
     * @returns {number} O ângulo de limite em graus.
     */
    private getAngleThresholdForEquipmentType(equipmentType: string): number {
        switch (equipmentType) {
            case 'BITREM':
                return 45;
            case 'TRBD':
                return 45;
            case 'COLH':
                return 30;
            case 'PLAN':
                return 35;
            default:
                return 40;
        }
    }
}

export default new ManeuveringService();
