import { EquipmentData } from "../models/EquipmentData";
import { EquipmentStatus } from "../models/EquipmentStatus";
import { DataPoint } from "../models/DataPoint";

import MotionService from "./MotionService"
import ManeuveringService from "./ManeuveringService";
import EquipmentDataService from "./EquipmentDataService";
import PairedEquipmentService from "./PairedEquipmentService";

class StatusService {
  /**
   * Analisa o status de um equipamento em um único ponto de dados.
   * @param {DataPoint} point O ponto de dados do equipamento.
   * @param {EquipmentData} allEquipmentData Os dados de todos os equipamentos.
   * @returns {Promise<EquipmentStatus>} Retorna um objeto EquipmentStatus com o ID do equipamento e o status atual.
   */
  public async analyzeStatusByPoint(point: DataPoint, allEquipmentData: EquipmentData, flattenEquipmentData: DataPoint[]): Promise<EquipmentStatus> {
    const nearOffset = 4; // Ajusta o offset utilizado nos cálculos da linha de máquina em movimento/parada ou manobrando
    const equipmentId = point.frota.toString();

    const nearOffsetPoints = EquipmentDataService.getNearOffsetPoints(point, allEquipmentData[equipmentId], nearOffset);

    const isMoving = MotionService.isInMotion(nearOffsetPoints);

    let status = isMoving ? 'Em movimento' : 'Parado';

    if (isMoving) {
      const isManeuveringFlag = ManeuveringService.isManeuvering(nearOffsetPoints);
      if (isManeuveringFlag) {
        status = 'Em manobra';
      } else {
        const pairedEquipment = await PairedEquipmentService.findPairedEquipment(equipmentId, point.tst, allEquipmentData, flattenEquipmentData);
        if (pairedEquipment) {
          const harvestTypes = ["TRBD", "COLH"];
          const isHarvesting = harvestTypes.includes(pairedEquipment.categoria) && harvestTypes.includes(point.categoria);
          if (isHarvesting) {
            status = `Em colheita`;
          };

          status += ` (pareado com ${pairedEquipment.frota})`;
        }
      }
    }

    return {
      id: equipmentId,
      status,
    };
  }

  /**
   * Analisa o status dos equipamentos em blocos de tamanho especificado.
   * @param {EquipmentData} equipmentData Os dados de todos os equipamentos.
   * @param {number} blockSize O tamanho dos blocos para analisar o status dos equipamentos.
   * @returns {Promise<EquipmentData>} Retorna um array de blocos de EquipmentStatus.
   */
  public async analyzeStatusByBlocks(equipmentData: EquipmentData, flattenEquipmentData: DataPoint[], blockSize: number): Promise<EquipmentData> {
    const equipmentIds = Object.keys(equipmentData);
    const totalEquipment = equipmentIds.length;
    const blocks = Math.ceil(totalEquipment / blockSize);

    let totalPoints = 0;
    let processedPoints = 0;

    // Calculate the total number of points
    for (const equipmentId of equipmentIds) {
      totalPoints += equipmentData[equipmentId].length;
    }

    for (let blockIndex = 0; blockIndex < blocks; blockIndex++) {
      const startIndex = blockIndex * blockSize;
      const endIndex = Math.min(startIndex + blockSize, totalEquipment);

      for (let i = startIndex; i < endIndex; i++) {
        const equipmentId = equipmentIds[i];
        const equipmentPoints = equipmentData[equipmentId];

        for (let pointIndex = 0; pointIndex < equipmentPoints.length; pointIndex++) {
          const point = equipmentPoints[pointIndex];
          const equipmentStatus = await this.analyzeStatusByPoint(point, equipmentData, flattenEquipmentData);
          equipmentPoints[pointIndex].status = equipmentStatus.status;

          processedPoints++;
          this.logProgress(processedPoints, totalPoints, equipmentId, equipmentStatus.status, point.tst, point.speed);
        }
      }
    }

    return equipmentData;
  }

  private logProgress(processedPoints: number, totalPoints: number, equipmentId: string, status: string, tst: number, speed: number): void {
    console.log(`Progresso: ${processedPoints}/${totalPoints} (${((processedPoints / totalPoints) * 100).toFixed(2)}%) Status: ${equipmentId} ${status} em ${tst} speed ${speed}`);
  }
}

export default new StatusService();
