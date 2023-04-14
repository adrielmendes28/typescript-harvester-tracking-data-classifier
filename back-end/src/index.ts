import DataRepository from './repositories/DataRepository';
import StatusService from "./services/StatusService";
import './app';
import DataPointService from './services/DataPointService';

async function start() {
    //console.log('Obtendo dados...');

    // Buscar pontos com status null
    const dataPoints = await DataPointService.getDataPointsWithNullStatus();
    const equipmentData = DataRepository.processDataPoints(dataPoints);
    const flattenEquipmentData = DataRepository.processDataPointsFlattenEquipmentData(dataPoints);
    //console.log(Object.keys(equipmentData));

    const blockSize = 2; // Ajuste o tamanho do bloco conforme necessário
    const equipmentStatusBlocks = await StatusService.analyzeStatusByBlocks(equipmentData, flattenEquipmentData, blockSize);

    // Atualizar status dos pontos no banco de dados
    for (const equipmentStatus of Object.keys(equipmentStatusBlocks)) {
        for (const dataPoint of equipmentStatusBlocks[equipmentStatus]) {
            await DataPointService.updateDataPointStatus(dataPoint.id, dataPoint.status, dataPoint.paired);
        }
    }

    //console.log('Status dos pontos atualizado no banco de dados');
    start();
}
setTimeout(() => {
    start(); // 500 ms = meio segundo
  }, 10000);


async function writeGrouped() {
    //console.log('Obtendo dados...')
    var groupedDataByEquipment = DataRepository.getGroupedDataByEquipment();
    DataRepository.writeDataToFile(groupedDataByEquipment);
}
// writeGrouped()

async function writeSheet() {
    //console.log('Obtendo dados...')
    var flattenEquipmentData = DataRepository.pureData();
    DataRepository.writeDataToCsv(flattenEquipmentData);
}
// writeSheet()