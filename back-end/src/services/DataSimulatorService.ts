import DataRepository from '../repositories/DataRepository';
import * as schedule from 'node-schedule';
import { DataPoint } from '../entities/DataPoint';
import { FlattenEquipmentData } from '../models/FlattenEquipmentData';

class DataSimulatorService {
  private data: FlattenEquipmentData;
  private timestamps: number[];
  private currentIndex: number;

  constructor() {
    this.data = DataRepository.flattenEquipmentData();
    this.timestamps = Object.keys(this.data).map(Number).sort((a, b) => a - b);
    this.currentIndex = 4333;
  }

  async startDataSimulation() {
    // Agenda a inserção de dados a cada 10 segundos
    setTimeout(() => {
      const interval = setInterval(async () => {
        await this.insertDataPoints();
      }, 200); // 500 ms = meio segundo
    }, 5000)
    //console.log('Data simulation started.');
  }

  async insertDataPoints() {
    //console.log('Inserting');
    if (this.currentIndex >= this.timestamps.length) {
      this.currentIndex = 0;
    }

    const currentTimestamp = this.timestamps[this.currentIndex];
    const currentDataPoints = this.data[currentTimestamp];

    for (const equipmentId in currentDataPoints) {
      const dataPoint = {
        combinedPrimaryKey: (
          currentDataPoints[equipmentId].frota +
          currentDataPoints[equipmentId].tst
        ).toString(),
        ...currentDataPoints[equipmentId],
        id: currentDataPoints[equipmentId].id.toString(),
        frota: currentDataPoints[equipmentId].frota.toString(),
        op: currentDataPoints[equipmentId].op.toString(),
        paired: currentDataPoints[equipmentId]?.paired?.toString(),
      };
      const insertQueryBuilder = DataPoint.createQueryBuilder("dataPoint");
      await insertQueryBuilder
        .insert()
        .values(dataPoint)
        .execute();
      //console.log(`Inserted data for equipment ${equipmentId} at timestamp ${currentTimestamp}.`);
    }

    this.currentIndex++;
  }
}

export default new DataSimulatorService();
