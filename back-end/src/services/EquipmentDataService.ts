/**
 * Essa classe é responsável por fornecer serviços relacionados aos dados de equipamentos.
 * Os dados são representados por objetos DataPoint.
 */
import { DataPoint } from "../models/DataPoint";

class EquipmentDataService {
  /**
   * Retorna um array de DataPoints próximos ao ponto fornecido.
   * @param {DataPoint} point O ponto de dados do equipamento.
   * @param {DataPoint[]} equipmentPoints Os pontos de dados do equipamento.
   * @param {number} numPoints O número de pontos próximos a serem retornados.
   * @returns {DataPoint[]} Retorna um array de DataPoints próximos ao ponto fornecido.
   */
  public getNearOffsetPoints(point: DataPoint, equipmentPoints: DataPoint[], numPoints: number): DataPoint[] {
    const currentIndex = equipmentPoints.findIndex((dataPoint) => dataPoint.tst === point.tst);

    if (currentIndex === -1) {
      // O ponto atual não foi encontrado nos dados do equipamento
      return [];
    }

    const startIndex = Math.max(0, currentIndex - numPoints);
    const endIndex = Math.min(equipmentPoints.length - 1, currentIndex + numPoints);

    return equipmentPoints.slice(startIndex, endIndex + 1);
  }

  /**
   * Retorna o ponto anterior ao ponto atual fornecido.
   * @param {DataPoint} currentPoint O ponto atual dos dados do equipamento.
   * @param {DataPoint[]} equipmentPoints Os pontos de dados do equipamento.
   * @returns {DataPoint | null} Retorna o ponto anterior ao ponto atual ou null se não houver ponto anterior.
   */
  public getPreviousPoint(currentPoint: DataPoint, equipmentPoints: DataPoint[]): DataPoint | null {
    const currentIndex = equipmentPoints.findIndex((dataPoint) => dataPoint.tst === currentPoint.tst);

    if (currentIndex === -1 || currentIndex === 0) {
      // O ponto atual não foi encontrado nos dados do equipamento ou é o primeiro ponto
      return null;
    }

    return equipmentPoints[currentIndex - 1];
  }
}

export default new EquipmentDataService();
