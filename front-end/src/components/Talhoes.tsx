import React, { useEffect, useState } from 'react';
import { fetchTalhoes } from '../services/talhoes';
import Talhao from './Talhao';
import { TalhaoType } from './Talhao';

const Talhoes: React.FC = () => {
  const [talhoes, setTalhoes] = useState<TalhaoType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTalhoes();
      setTalhoes(data);
    };

    fetchData();
  }, []);

  return (
    <>
      {talhoes.map((talhao) => (
        <Talhao key={talhao.C} talhao={talhao} />
      ))}
    </>
  );
};

export default Talhoes;
