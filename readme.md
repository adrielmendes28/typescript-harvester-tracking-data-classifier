# Projeto de Análise de Status de Equipamentos
Este projeto é responsável por analisar o status de diversos equipamentos e identificar se eles estão em movimento, parados, realizando manobras ou em colheita, com base em dados de GPS, velocidade e direção. Além disso, o projeto também verifica se há equipamentos pareados, ou seja, trabalhando juntos.

``Instalação``
Para instalar as dependências do projeto, execute:

```
yarn install
```

## Funcionalidades
O projeto é composto pelos seguintes serviços:

`StatusService`: Responsável pela análise do status dos equipamentos.
`MotionService`: Verifica se o equipamento está em movimento ou parado.
`ManeuveringService`: Verifica se o equipamento está realizando manobras.
`EquipmentDataService`: Obtém pontos de dados próximos ao ponto de referência.
`PairedEquipmentService`: Encontra equipamentos pareados com base no ID do equipamento, timestamp e dados de todos os equipamentos.
`DataRepository`: Carrega os dados dos equipamentos e os organiza em um formato adequado para análise.

## Execução
Para executar o projeto, siga os seguintes passos:

Compile o projeto:
```
yarn build
```

Carregue os dados dos equipamentos no arquivo dist/static/data.json.

Execute o script principal do projeto:

```
yarn start
```

Após a execução, os resultados da análise serão exibidos no console e também serão salvos no arquivo output/data.json.

## Licença
Este projeto foi desenvolvido para fins privados.
