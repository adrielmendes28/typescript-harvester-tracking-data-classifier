import { EquipmentStatus } from './../models/EquipmentStatus';
import { DataPoint } from "../entities/DataPoint";

class DataService {
    async getLastDataPoints(
        frota?: string,
        frente?: string,
        startDate?: string,
        endDate?: string
    ): Promise<DataPoint[]> {
        const query = DataPoint.createQueryBuilder("dataPoint");

        query
            .select([
                "dataPoint.frota as frota",
                "dataPoint.tst as tst",
                "dataPoint.deveui as deveui",
                "dataPoint.op as op",
                "dataPoint.stid as stid",
                "dataPoint.status as status",
                "dataPoint.paired as paired",
                "dataPoint.categoria as categoria",
                "dataPoint.operacao as operacao",
                "dataPoint.Frente as frente",
                "dataPoint.tsd as tsd",
                "dataPoint.lat as lat",
                "dataPoint.lon as lon",
                "dataPoint.head as head",
                "dataPoint.speed as speed",
                "dataPoint.rssi as rssi",
                "dataPoint.snr as snr",
                "dataPoint.sf as sf",
            ])
            .where(
                `dataPoint.tst IN (
            SELECT MAX(subDataPoint.tst)
            FROM DataPoints subDataPoint
            WHERE subDataPoint.frota = dataPoint.frota
            ${frota ? "AND subDataPoint.frota = :frota" : ""}
            ${frente ? "AND subDataPoint.Frente = :frente" : ""}
            ${startDate ? "AND subDataPoint.tsd >= :startDate" : ""}
            ${endDate ? "AND subDataPoint.tsd <= :endDate" : ""}
            GROUP BY subDataPoint.frota
        )`
            );

        if (frota) {
            query.setParameter("frota", frota);
        }

        if (frente) {
            query.setParameter("frente", frente);
        }

        if (startDate) {
            query.setParameter("startDate", startDate);
        }

        if (endDate) {
            query.setParameter("endDate", endDate);
        }

        const dataPoints = await query.getRawMany();

        return dataPoints;
    };



    async getEquipmentTrails(
        frota?: string,
        frente?: string,
        startDate?: string,
        endDate?: string
    ): Promise<DataPoint[][]> {
        const query = DataPoint.createQueryBuilder("dataPoint");

        query.select([
            "dataPoint.frota as frota",
            "dataPoint.tst as tst",
            "dataPoint.deveui as deveui",
            "dataPoint.op as op",
            "dataPoint.stid as stid",
            "dataPoint.status as status",
            "dataPoint.paired as paired",
            "dataPoint.categoria as categoria",
            "dataPoint.operacao as operacao",
            "dataPoint.Frente as frente",
            "dataPoint.tsd as tsd",
            "dataPoint.lat as lat",
            "dataPoint.lon as lon",
            "dataPoint.head as head",
            "dataPoint.speed as speed",
            "dataPoint.rssi as rssi",
            "dataPoint.snr as snr",
            "dataPoint.sf as sf",
        ]);

        if (frota) query.andWhere("dataPoint.frota = :frota", { frota });
        if (frente) query.andWhere("dataPoint.Frente = :frente", { frente });
        if (startDate) query.andWhere("dataPoint.tsd >= :startDate", { startDate });
        if (endDate) query.andWhere("dataPoint.tsd <= :endDate", { endDate });

        query.orderBy("dataPoint.frota").addOrderBy("dataPoint.tst", "ASC");

        try {
            const dataPoints = await query.getRawMany();
            //console.log("Data Points: ", dataPoints);

            const trails: DataPoint[][] = [];
            let currentTrail: DataPoint[] = [];
            let currentFrota = "";

            for (const dataPoint of dataPoints) {
                if (currentFrota !== dataPoint.frota) {
                    if (currentTrail.length > 0) {
                        trails.push(currentTrail);
                    }
                    currentTrail = [];
                    currentFrota = dataPoint.frota;
                }
                currentTrail.push(dataPoint);
            }

            if (currentTrail.length > 0) {
                trails.push(currentTrail);
            }

            return trails;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    async getEquipmentSummary(): Promise<any> {
        const query = DataPoint.createQueryBuilder("dataPoint")
            .select([
                "dataPoint.frota as frota",
                "dataPoint.Frente as frente",
                "MAX(dataPoint.tsd) as tsd",
                "dataPoint.status as status",
                "dataPoint.paired as paired",
            ])
            .where("dataPoint.status IS NOT NULL")
            .groupBy("dataPoint.frota")
            .addGroupBy("dataPoint.Frente")
            .addGroupBy("dataPoint.status")
            .addGroupBy("dataPoint.paired")
            .orderBy("dataPoint.frota");

        const equipmentSummary = await query.getRawMany();
        return equipmentSummary;
    };

    async filterEquipmentSummaryByFrota(): Promise<any> {
        const equipmentSummary = await this.getLastDataPoints();
        const uniqueFrotas: any = {};
        const filteredSummary = equipmentSummary.reduce((accumulator: any, current: any) => {
            if (!uniqueFrotas[current.frota]) {
                uniqueFrotas[current.frota] = true;
                accumulator.push(current);
            } else {
                const index = accumulator.findIndex((e: any) => e.frota === current.frota);
                if (index !== -1 && current.tst > accumulator[index].tst) {
                    accumulator[index] = current;
                }
            }
            return accumulator;
        }, []);

        return filteredSummary.sort((a: any, b: any) => a.frota.localeCompare(b.frota));
    }


    async updateDataPointStatus(id: string, status: any, paired: any): Promise<void> {
        await DataPoint.createQueryBuilder()
            .update(DataPoint)
            .set({ status: status as any, paired: paired as any })
            .where("id = :id", { id })
            .execute();
    }

    async getDataPointsWithNullStatus(): Promise<DataPoint[]> {
        const query = DataPoint.createQueryBuilder("dataPoint")
            .where("dataPoint.status IS NULL");

        const dataPoints = await query.getMany();
        return dataPoints;
    }
}
export default new DataService();