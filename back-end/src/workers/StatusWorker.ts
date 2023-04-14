import { parentPort, workerData } from 'worker_threads';
import { EquipmentData } from '../models/EquipmentData';
import { WorkerData } from '../models/WorkerData';
import StatusService from '../services/StatusService';

function calculateTotalPoints(equipmentData: EquipmentData, startIndex: number, endIndex: number) {
  let totalPoints = 0;
  for (let i = startIndex; i < endIndex; i++) {
    const equipmentId = Object.keys(equipmentData)[i];
    const equipmentPoints = equipmentData[equipmentId];
    totalPoints += equipmentPoints.length;
  }
  return totalPoints;
}

async function processBlock() {
  if (!parentPort) return;

  const { equipmentData, flattenEquipmentData, startIndex, endIndex }: WorkerData = workerData;

  const partialResult: EquipmentData = {};

  let processedPointsTotal = 0;
  const totalPointsTotal = calculateTotalPoints(equipmentData, startIndex, endIndex);

  for (let i = startIndex; i < endIndex; i++) {
    const equipmentId = Object.keys(equipmentData)[i];
    const equipmentPoints = equipmentData[equipmentId];

    for (let pointIndex = 0; pointIndex < equipmentPoints.length; pointIndex++) {
      const point = equipmentPoints[pointIndex];
      const equipmentStatus = await StatusService.analyzeStatusByPoint(point, equipmentData, flattenEquipmentData);
      equipmentPoints[pointIndex].status = equipmentStatus.status;
      equipmentPoints[pointIndex].paired = equipmentStatus.paired;

      // Enviar mensagem de progresso para o processo principal
      processedPointsTotal++;
      parentPort.postMessage({
        type: 'progress',
        processedPoints: processedPointsTotal,
        totalPoints: totalPointsTotal,
        equipmentStatus,
        tst: point.tst,
        speed: point.speed
      });
    }

    partialResult[equipmentId] = equipmentPoints;
  }
  // Enviar mensagem de resultado para o processo principal
  parentPort.postMessage({ type: 'result', result: partialResult });

  // Fechar a comunicação entre o worker e o processo principal
  parentPort.close();
}

processBlock();
