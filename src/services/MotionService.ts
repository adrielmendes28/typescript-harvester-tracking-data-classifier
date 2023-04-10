import { DataPoint } from "../models/DataPoint";

import { getDistance } from 'geolib';

class MotionService {
    /**
     * Verifica se o objeto está em movimento com base nos pontos de dados fornecidos.
     * @param {DataPoint[]} data Um array de pontos de dados com latitude, longitude e timestamp.
     * @returns {boolean} Retorna true se o objeto estiver em movimento e false se o objeto estiver parado.
     */
    public isInMotion(data: DataPoint[]): boolean {
        const threshold = 1; // Limite de distância mínimo em metros para considerar o objeto parado (devido a imprecisão do gps que gera um movimento em "estrela" parado)
        const minTimeDifference = 10; // Intervalo de tempo mínimo em segundos para considerar o objeto parado (exemplo: 60 segundos)
        const minSpeed = 0.2; // Limite mínimo de velocidade em m/s
        // Verifique se os dados fornecidos são suficientes para realizar a análise
        if (data.length < 2) {
            return false;
        }
        const firstPoint = data[0];
        const middlePoint = data[1];
        const lastPoint = data[data.length - 1];
        // Calcule a distância entre o primeiro e o último ponto
        const distance = getDistance(
            { latitude: firstPoint.lat, longitude: firstPoint.lon },
            { latitude: middlePoint.lat, longitude: middlePoint.lon }
        );

        // Calcule a diferença de tempo entre o primeiro e o último ponto
        const timeDifference = lastPoint.tst - firstPoint.tst;
        // Calcule a velocidade média entre o primeiro e o último ponto
        const speed = distance / timeDifference;

        // Se a distância percorrida for maior que o limite e a diferença de tempo for maior que o tempo mínimo e a velocidade for maior que o mínimo, o objeto está em movimento
        if (distance > threshold && timeDifference >= minTimeDifference && (speed > minSpeed || middlePoint.speed > minSpeed)) {
            return true;
        }
        return false;
    }
}
export default new MotionService();
