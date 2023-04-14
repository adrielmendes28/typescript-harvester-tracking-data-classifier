import { DataPoint } from '../models/DataPoint';
import { EquipmentData } from '../models/EquipmentData';
import data from '../../static/data.json';
import fs from 'fs';
import { FlattenEquipmentData } from '../models/FlattenEquipmentData';

class DataRepository {
  private readonly OUTPUT_DIR = 'output';

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

  /**
   * Retorna os dados do equipamento achatados em um objeto, com timestamps como chaves.
   * @returns {FlattenEquipmentData} Retorna um objeto de pontos de dados achatados de todos os equipamentos.
   */
  public flattenEquipmentData(): FlattenEquipmentData {
    const flattenedData: FlattenEquipmentData = {};

    data.forEach((dataPoint: DataPoint) => {
      const timestamp = dataPoint.tst;
      const equipmentId = dataPoint.id;

      if (!flattenedData[timestamp]) {
        flattenedData[timestamp] = {};
      }

      flattenedData[timestamp][equipmentId] = dataPoint;
    });

    return flattenedData;
  }

  /**
   * Retorna os dados do equipamento achatados em um único array de pontos de dados.
   * @returns {DataPoint[]} Retorna um array de pontos de dados achatados de todos os equipamentos.
   */
  public pureData(): DataPoint[] {
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
    fs.writeFileSync(this.OUTPUT_DIR + '/data.json', jsonData);
  }

  /**
   * Escreve os dados em um arquivo no formato CSV a partir de um array de objetos JSON.
   * @param {Array<Object>} data Array de objetos JSON a serem escritos no arquivo CSV.
   */
  public writeDataToCsv(data: DataPoint[]) {
    // Converte o array de objetos JSON em um array de arrays
    const csvData = data.map((obj) => Object.values(obj));

    // Extrai os nomes das chaves do primeiro objeto como cabeçalho do CSV
    const header = Object.keys(data[0]).join(',');

    // Converte o array de arrays em uma string CSV
    const csvString = csvData.map((row) => row.join(',')).join('\n');

    // Escreve a string CSV no arquivo, incluindo o cabeçalho
    fs.writeFileSync(this.OUTPUT_DIR + '/data.csv', `${header}\n${csvString}`);
  }

  // Em DataRepository.ts

  public processDataPoints(dataPoints: DataPoint[]): { [frota: string]: DataPoint[] } {
    const equipmentData: { [frota: string]: DataPoint[] } = {};

    for (const dataPoint of dataPoints) {
      const frota = dataPoint.frota;

      if (!equipmentData[frota]) {
        equipmentData[frota] = [];
      }

      equipmentData[frota].push(dataPoint);
    }

    return equipmentData;
  }


  public processDataPointsFlattenEquipmentData(data:  DataPoint[]): FlattenEquipmentData {
    const flattenedData: FlattenEquipmentData = {};

    data.forEach((dataPoint: DataPoint) => {
      const timestamp = dataPoint.tst;
      const equipmentId = dataPoint.id;

      if (!flattenedData[timestamp]) {
        flattenedData[timestamp] = {};
      }

      flattenedData[timestamp][equipmentId] = dataPoint;
    });

    return flattenedData;
  }


}

export default new DataRepository();
