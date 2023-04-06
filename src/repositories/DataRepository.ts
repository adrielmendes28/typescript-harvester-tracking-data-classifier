import { DataPoint } from '../models/DataPoint';
import { EquipmentData } from '../models/EquipmentData';
import data from '../../static/data.json';
import fs from 'fs';

class DataRepository {
  private readonly DATA_FILE_PATH = 'output/data.json';

  /**
   * Divide os dados em grupos por equipamento usando o campo 'frota' como identificador.
   * @returns {DataPoint[][]} Retorna um objeto EquipmentData com os dados divididos por equipamento.
   */
   public getGroupedDataByEquipment(): any[][] {
    const equipmentData: EquipmentData = {};

    for (const item of (data as any[])) {
      const equipmentId = item.frota.toString();
      item.lng = item.lon;
      delete item.lon;
      if (equipmentData[equipmentId]) {
        equipmentData[equipmentId].push(item);
      } else {
        equipmentData[equipmentId] = [item];
      }
    }

    const equipmentIds = Object.keys(equipmentData);
    const groupedDataPoint: DataPoint[][] = equipmentIds.map(equipmentId => equipmentData[equipmentId]);

    return groupedDataPoint;
  }


  /**
   * Divide os dados em grupos por equipamento usando o campo 'frota' como identificador.
   * @returns {EquipmentData} Retorna um objeto EquipmentData com os dados divididos por equipamento.
   */
  public getIndexedDataByEquipment(): EquipmentData {
    const equipmentData: EquipmentData = {};

    for (const item of (data as DataPoint[])) {
      const equipmentId = item.frota.toString();
      if (equipmentData[equipmentId]) {
        equipmentData[equipmentId].push(item);
      } else {
        equipmentData[equipmentId] = [item];
      }
    }

    return equipmentData;
  }

  public flattenEquipmentData(): DataPoint[] {
    return data;
  }

  /**
   * Converte um objeto EquipmentData em um array de DataPoint.
   * @param {EquipmentData} equipmentData O objeto EquipmentData a ser convertido.
   * @returns {DataPoint[]} Retorna um array de DataPoint correspondente aos dados originais.
   */
  public convertEquipmentDataToJSON(equipmentData: EquipmentData): DataPoint[] {
    const data: DataPoint[] = [];

    for (const equipmentId in equipmentData) {
      if (Object.prototype.hasOwnProperty.call(equipmentData, equipmentId)) {
        for (const point of equipmentData[equipmentId]) {
          data.push(point);
        }
      }
    }

    return data;
  }

  /**
   * Escreve os dados em um arquivo data.json.
   * @param {any} data Os dados a serem escritos.
   */
  public writeDataToFile(data: any) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.DATA_FILE_PATH, jsonData);
  }
}

export default new DataRepository();
