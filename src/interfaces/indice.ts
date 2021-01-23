import ObjMateria from './materia';

interface IndiceConfig{
    llaveStorage: string;
    llaveCambios: string;
    cantidadMaxima: number;
    tipoIndice: string;
    default: ObjMateria[];
};

export default IndiceConfig;