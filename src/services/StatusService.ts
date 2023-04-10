import { getDistance } from 'geolib';
import { EquipmentData } from "../models/EquipmentData";
import { EquipmentStatus, EquipmentStatusEnum } from "../models/EquipmentStatus";
import { DataPoint } from "../models/DataPoint";

import MotionService from "./MotionService"
import ManeuveringService from "./ManeuveringService";
import EquipmentDataService from "./EquipmentDataService";
import PairedEquipmentService from "./PairedEquipmentService";
import { Worker } from 'worker_threads';
import path from 'path';

class StatusService {
  private readonly NEAR_OFFSET = 1; // Ajusta o offset utilizado nos cálculos da linha de máquina em movimento/parada ou manobrando
  private workerProgress: { [workerId: number]: { processedPoints: number, totalPoints: number } } = {};

  /**
   * Analisa o status de um equipamento em um único ponto de dados.
   * @param {DataPoint} point O ponto de dados do equipamento.
   * @param {EquipmentData} allEquipmentData Os dados de todos os equipamentos.
   * @returns {Promise<EquipmentStatus>} Retorna um objeto EquipmentStatus com o ID do equipamento e o status atual.
   */

  public async analyzeStatusByPoint(point: DataPoint, allEquipmentData: EquipmentData, flattenEquipmentData: DataPoint[]): Promise<EquipmentStatus> {
    const equipmentId = point.frota.toString();
    const nearOffsetPoints = EquipmentDataService.getNearOffsetPoints(point, allEquipmentData[equipmentId], this.NEAR_OFFSET);

    let status = this.getInitialStatus(nearOffsetPoints);
    let paired = null;

    const isMoving = status === EquipmentStatusEnum.MOVING;
    if (isMoving) {
      const response = await this.getUpdatedStatus(point, nearOffsetPoints, allEquipmentData, flattenEquipmentData, status, equipmentId);
      status = response.status;
      paired = response.paired;
    } else {
      const response = await this.getPairedStatus(point, allEquipmentData, flattenEquipmentData, equipmentId, status);
      status = response.status;
      paired = response.paired;
    }

    return {
      id: equipmentId,
      status,
      paired
    };
  }

  /**
    * Obtém o status do equipamento pareado, se houver algum.
    * @param {DataPoint} point O ponto de dados atual.
    * @param {EquipmentData} allEquipmentData Os dados de todos os equipamentos.
    * @param {DataPoint[]} flattenEquipmentData Um array de pontos de dados achatados de todos os equipamentos.
    * @param {string} equipmentId O ID do equipamento.
    * @param {EquipmentStatusEnum} status O status atual do equipamento.
    * @returns {Promise<EquipmentStatus>} Retorna uma promessa que resolve com o status atualizado do equipamento, incluindo informações sobre o equipamento pareado.
    */
  private async getPairedStatus(point: DataPoint, allEquipmentData: EquipmentData, flattenEquipmentData: DataPoint[], equipmentId: string, status: EquipmentStatusEnum): Promise<EquipmentStatus> {
    const pairedEquipment = await PairedEquipmentService.findPairedEquipment(equipmentId, point.tst, allEquipmentData, flattenEquipmentData);
    let paired = null;
    if (pairedEquipment) {
      const response = this.updateStatusWithPairedEquipment(point, pairedEquipment, status);
      paired = response.paired;
      status = response.status;
    }

    return { status, paired };
  }

  /**
   * Obtém o status inicial do equipamento com base nos pontos de dados próximos.
   * @param {DataPoint[]} nearOffsetPoints Um array de pontos de dados próximos ao equipamento.
   * @returns {string} Retorna o status inicial do equipamento, que pode ser 'Em movimento' ou 'Parado'.
   */
  private getInitialStatus(nearOffsetPoints: DataPoint[]): EquipmentStatusEnum {
    const isMoving = MotionService.isInMotion(nearOffsetPoints);
    return isMoving ? EquipmentStatusEnum.MOVING : EquipmentStatusEnum.STOPPED;
  }

  /**
    * Atualiza o status do equipamento com base nos pontos de dados próximos, dados do equipamento e status atual.
    * @param {DataPoint} point O ponto de dados atual.
    * @param {DataPoint[]} nearOffsetPoints Um array de pontos de dados próximos ao equipamento.
    * @param {EquipmentData} allEquipmentData Os dados de todos os equipamentos.
    * @param {DataPoint[]} flattenEquipmentData Um array de pontos de dados achatados de todos os equipamentos.
    * @param {string} status O status atual do equipamento.
    * @param {string} equipmentId O ID do equipamento.
    * @returns {Promise<EquipmentStatus>} Retorna uma promessa que resolve com o status atualizado do equipamento.
    */
  private async getUpdatedStatus(point: DataPoint, nearOffsetPoints: DataPoint[], allEquipmentData: EquipmentData, flattenEquipmentData: DataPoint[], status: EquipmentStatusEnum, equipmentId: string): Promise<EquipmentStatus> {
    const isManeuvering = ManeuveringService.isManeuvering(nearOffsetPoints);
    let paired = null;
    if (isManeuvering) {
      status = EquipmentStatusEnum.MANEUVERING;
      status = this.updateStatusWithLastPoint(point, allEquipmentData, equipmentId, status, EquipmentStatusEnum.STOPPED, 5);
    } else {
      const response = await this.getHarvestingStatus(point, allEquipmentData, flattenEquipmentData, equipmentId, status);
      status = response.status;
      paired = response.paired;
    }

    return { status, paired };
  }

  /**
   * Obtém o status de colheita do equipamento, verificando se há um equipamento pareado e atualizando o status de acordo.
   * @param {DataPoint} point O ponto de dados atual.
   * @param {EquipmentData} allEquipmentData Os dados de todos os equipamentos.
   * @param {DataPoint[]} flattenEquipmentData Um array de pontos de dados achatados de todos os equipamentos.
   * @param {string} equipmentId O ID do equipamento.
   * @param {string} status O status atual do equipamento.
   * @returns {Promise<EquipmentStatus>} Retorna uma promessa que resolve com o status de colheita atualizado do equipamento.
   */
  private async getHarvestingStatus(point: DataPoint, allEquipmentData: EquipmentData, flattenEquipmentData: DataPoint[], equipmentId: string, status: EquipmentStatusEnum): Promise<EquipmentStatus> {
    const response = await this.getPairedStatus(point, allEquipmentData, flattenEquipmentData, equipmentId, status);
    if (response.paired) {
      return response;
    } else {
      status = this.updateStatusWithLastPoint(point, allEquipmentData, equipmentId, status, EquipmentStatusEnum.STOPPED, 5);
      status = this.updateStatusWithLastPoint(point, allEquipmentData, equipmentId, status, EquipmentStatusEnum.HARVESTING, 20);
      return { status, paired: null };
    }
  }

  /**
   * Atualiza o status do equipamento com base no equipamento pareado e verifica se ambos os equipamentos estão em processo de colheita.
   * @param {DataPoint} point O ponto de dados atual.
   * @param {DataPoint} pairedEquipment O ponto de dados do equipamento pareado.
   * @param {string} status O status atual do equipamento.
   * @returns {EquipmentStatus} Retorna o status atualizado do equipamento, incluindo informações sobre o equipamento pareado.
   */
  private updateStatusWithPairedEquipment(point: DataPoint, pairedEquipment: DataPoint, status: EquipmentStatusEnum): EquipmentStatus {
    const harvestTypes = ["TRBD", "COLH"];
    const isHarvesting = harvestTypes.includes(pairedEquipment.categoria) && harvestTypes.includes(point.categoria);

    if (isHarvesting) {
      status = EquipmentStatusEnum.HARVESTING;
    }

    return { status, paired: pairedEquipment.frota };
  }

  /**
   * Atualiza o status do equipamento com base no ponto de dados anterior e verifica se o status anterior começa com a string fornecida e se a distância entre os pontos está dentro do limite máximo.
   * @param {DataPoint} point O ponto de dados atual.
   * @param {EquipmentData} allEquipmentData Os dados de todos os equipamentos.
   * @param {string} equipmentId O ID do equipamento.
   * @param {string} status O status atual do equipamento.
   * @param {string} startsWith A string para verificar se o status anterior começa com ela.
   * @param {number} maxDistance A distância máxima permitida entre os pontos para considerar o status anterior válido.
   * @returns {EquipmentStatus} Retorna o status atualizado do equipamento.
   */
  private updateStatusWithLastPoint(point: DataPoint, allEquipmentData: EquipmentData, equipmentId: string, status: EquipmentStatusEnum, startsWith: EquipmentStatusEnum, maxDistance: number): EquipmentStatusEnum {
    const lastPoint = EquipmentDataService.getPreviousPoint(point, allEquipmentData[equipmentId]);

    if (lastPoint) {
      const isLastPointValidStatus = lastPoint.status.startsWith(startsWith);
      const distance = getDistance(
        { latitude: point.lat, longitude: point.lon },
        { latitude: lastPoint.lat, longitude: lastPoint.lon }
      );

      if (isLastPointValidStatus && distance < maxDistance) {
        status = lastPoint.status;
      }
    }

    return status;
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
    const workers = [];
    const results: any[] = [];

    for (let blockIndex = 0; blockIndex < blocks; blockIndex++) {
      const startIndex = blockIndex * blockSize;
      const endIndex = Math.min(startIndex + blockSize, totalEquipment);

      const worker = new Worker(path.resolve(__dirname, '../workers/StatusWorker.js'), {
        workerData: {
          equipmentData,
          flattenEquipmentData,
          startIndex,
          endIndex
        }
      });


      worker.on('message', (message) => {
        if (message.type === 'progress') {
          this.workerProgress[message.workerId] = { processedPoints: message.processedPoints, totalPoints: message.totalPoints }
          this.logProgress(
            blockIndex,
            message.processedPoints,
            message.totalPoints,
            message.equipmentStatus,
            message.tst,
            message.speed
          );
        }
      });

      const resultPromise = new Promise<any>((resolve, reject) => {
        worker.on('message', (message) => {
          if (message.type === 'result') {
            resolve(message.result);
          }
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });

      results.push(resultPromise);
      workers.push(worker);
    }

    const partialResults = await Promise.all(results);

    // Combinar resultados parciais
    const combinedResults: EquipmentData = {};
    partialResults.forEach((partialResult) => {
      Object.assign(combinedResults, partialResult);
    });

    // Encerrar os workers
    workers.forEach((worker) => {
      worker.terminate();
    });

    return combinedResults;
  }

  /**
   * Registra o progresso da análise de status do equipamento no console.
   * @param {number} processedPoints O número de pontos de dados já processados.
   * @param {number} totalPoints O número total de pontos de dados a serem processados.
   * @param {string} equipmentId O ID do equipamento.
   * @param {string} status O status atual do equipamento.
   * @param {number} tst O timestamp do ponto de dados atual.
   * @param {number} speed A velocidade do equipamento no ponto de dados atual.
   * @returns {void}
   */
  private logProgress(workerId: number, processedPoints: number, totalPoints: number, equipmentStatus: EquipmentStatus, tst: number, speed: number): void {
    this.workerProgress[workerId] = { processedPoints, totalPoints };

    const allWorkersProcessedPoints = Object.values(this.workerProgress).reduce((acc, progress) => acc + progress.processedPoints, 0);
    const allWorkersTotalPoints = Object.values(this.workerProgress).reduce((acc, progress) => acc + progress.totalPoints, 0);
    const globalProgressPercentage = ((allWorkersProcessedPoints / allWorkersTotalPoints) * 100).toFixed(2);

    console.log(`Worker ${workerId} Progresso: ${processedPoints}/${totalPoints} (${((processedPoints / totalPoints) * 100).toFixed(2)}%) Progresso Global: ${globalProgressPercentage}% Status: ${equipmentStatus.id} ${equipmentStatus.status} ${equipmentStatus.paired ? `(pareado com ${equipmentStatus.paired})` : ''} em ${tst} speed ${speed}`);
  }

}

export default new StatusService();
