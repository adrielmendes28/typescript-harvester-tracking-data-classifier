import { DataPoint } from "../models/DataPoint";
import { EquipmentData } from "../models/EquipmentData";

import { getDistance, findNearest } from 'geolib';
import { FlattenEquipmentData } from "../models/FlattenEquipmentData";

class PairedEquipmentService {
    private readonly ANGLE_THRESHOLD = 20; // Limite de variação de ângulo em graus para considerar equipamentos pareados
    private readonly SPEED_THRESHOLD = 4;  // Limite de variação de velocidade para considerar equipamentos pareados
    private readonly DISTANCE_THRESHOLD = 30; // Limite de distância entre os equipamentos para considerar equipamentos pareados

    /**
     * Encontra o equipamento pareado com base no ID do equipamento, timestamp e dados de todos os equipamentos.
     *
     * @param {string} equipmentId - ID do equipamento.
     * @param {number} timestamp - Timestamp em que o pareamento deve ser verificado.
     * @param {EquipmentData} allEquipmentData - Dados de todos os equipamentos.
     * @param {FlattenEquipmentData} flattenEquipmentData - Lista de pontos de dados de todos os equipamentos em um único array.
     * @return {Promise<DataPoint | null>} Retorna o DataPoint do equipamento pareado, caso encontrado, ou null.
     */
    public async findPairedEquipment(
        equipmentId: string,
        timestamp: number,
        allEquipmentData: EquipmentData,
        flattenEquipmentData: FlattenEquipmentData
    ): Promise<DataPoint | null> {
        const equipment1Point = this.getLastDataPointForTimestamp(allEquipmentData[equipmentId], timestamp);
        if (!equipment1Point) return null;

        const otherEquipmentDataOnSameTimestamp = this.getOtherEquipmentDataForTimestamp(flattenEquipmentData, equipment1Point, timestamp);
        if (otherEquipmentDataOnSameTimestamp.length === 0) return null;

        const equipment2Point = this.findNearestPoint(equipment1Point, otherEquipmentDataOnSameTimestamp);
        return this.isPairedEquipment(equipment1Point, equipment2Point) ? equipment2Point : null;
    }

    /**
     * Obtém o último ponto de dados para um determinado timestamp.
     *
     * @param {DataPoint[]} dataPoints - Array de pontos de dados para filtrar.
     * @param {number} timestamp - Timestamp para filtrar os pontos de dados.
     * @return {DataPoint | null} Retorna o último ponto de dados com o timestamp fornecido ou null se não encontrado.
     */
    private getLastDataPointForTimestamp(dataPoints: DataPoint[], timestamp: number): DataPoint | null {
        const filteredData = dataPoints.filter((point) => point.tst === timestamp);
        return filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
    }

    /**
     * Obtém os pontos de dados de outros equipamentos com o mesmo timestamp e categoria diferente.
     *
     * @param {FlattenEquipmentData} flattenEquipmentData - Lista de pontos de dados de todos os equipamentos em um único array.
     * @param {DataPoint} equipment1Point - Ponto de dados do equipamento de referência.
     * @param {number} timestamp - Timestamp para filtrar os pontos de dados.
     * @return {DataPoint[]} Retorna um array de pontos de dados de outros equipamentos no mesmo timestamp e categoria diferente.
     */
     private getOtherEquipmentDataForTimestamp(
        flattenEquipmentData: FlattenEquipmentData,
        equipment1Point: DataPoint,
        timestamp: number
    ): DataPoint[] {
        const dataAtTimestamp = flattenEquipmentData[timestamp];
        if (!dataAtTimestamp) return [];
    
        return Object.values(dataAtTimestamp).filter(
            (point) => point.categoria !== equipment1Point.categoria
        );
    }

    /**
     * Verifica se dois pontos de dados de equipamentos estão pareados.
     *
     * @param {DataPoint} equipment1Point - Ponto de dados do primeiro equipamento.
     * @param {DataPoint} equipment2Point - Ponto de dados do segundo equipamento.
     * @return {boolean} Retorna verdadeiro se os equipamentos estiverem pareados, caso contrário, retorna falso.
     */
    private isPairedEquipment(equipment1Point: DataPoint, equipment2Point: DataPoint): boolean {
        const distance = getDistance(
            { latitude: equipment1Point.lat, longitude: equipment1Point.lon },
            { latitude: equipment2Point.lat, longitude: equipment2Point.lon }
        );
        const angleDifference = Math.abs(equipment1Point.head - equipment2Point.head);
        const speedDifference = Math.abs(equipment1Point.speed - equipment2Point.speed);

        return (
            angleDifference <= this.ANGLE_THRESHOLD &&
            speedDifference <= this.SPEED_THRESHOLD &&
            distance <= this.DISTANCE_THRESHOLD
        );
    }

    /**
     * Encontra o ponto mais próximo ao ponto de referência fornecido.
     * 
     * @param {DataPoint} referencePoint - Ponto de referência para encontrar o ponto mais próximo.
     * @param {DataPoint[]} points - Um array de pontos de dados para verificar a distância em relação ao ponto de referência.
     * @returns {DataPoint} Retorna o ponto mais próximo ao ponto de referência.
     */
    public findNearestPoint(referencePoint: DataPoint, points: DataPoint[]): DataPoint {
        return findNearest(referencePoint, points) as DataPoint;
    }
}

export default new PairedEquipmentService();
