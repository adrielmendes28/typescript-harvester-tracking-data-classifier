import DataRepository from './repositories/DataRepository';
import StatusService from "./services/StatusService";

async function start() {
    console.log('Obtendo dados...')
    var equipmentData = DataRepository.getIndexedDataByEquipment();
    var flattenEquipmentData = DataRepository.flattenEquipmentData();
    console.log(Object.keys(equipmentData));

    const blockSize = 5; // Ajuste o tamanho do bloco conforme necessário
    const equipmentStatusBlocks = await StatusService.analyzeStatusByBlocks(equipmentData, flattenEquipmentData, blockSize);

    console.log(equipmentStatusBlocks);
    DataRepository.writeDataToFile(DataRepository.convertEquipmentDataToJSON(equipmentStatusBlocks));
}
// start();


async function writeGrouped(){
    console.log('Obtendo dados...')
    var flattenEquipmentData = DataRepository.getGroupedDataByEquipment();
    DataRepository.writeDataToFile(flattenEquipmentData);
}
writeGrouped()