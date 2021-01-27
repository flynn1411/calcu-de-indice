import React from 'react';
import {
    Line,
    LineChart,
    YAxis,
    XAxis,
    CartesianGrid,
    ReferenceLine,
    Tooltip,
    Label
} from 'recharts';
import ObjMateria from '../interfaces/materia';

export interface GraphModeProps {
    materias: ObjMateria[],
    indiceActual: number
}
 
const GraphMode: React.FC<GraphModeProps> = (
    {materias, indiceActual}: GraphModeProps
) => {

    let indice: number = indiceActual;

    if(indice === -1){
        let materiasSinNSP: ObjMateria[] = materias.filter(materia => materia.UV !== 0 || materia.Nota !== 0) as ObjMateria[];

        if(materiasSinNSP.length > 0){
            let sumaUv: number = 0;
            let sumaNota: number = 0;

            materiasSinNSP.forEach(materia => {
                sumaNota += materia.Nota * materia.UV;
                sumaUv += materia.UV;
            });

            indice = Math.round(sumaNota/sumaUv);
        }

    }

    let labelIndice: string = `Índice Actual: ${indice}`;
    let labelRPB: string = "RPB";
    let colorIndice: string = indice < 65 ? "var(--failed)" : "var(--passed)";

    let colorShadow = (nota: number | null): string => {
        let shadow= "var(--box-shadow2)"

        if(nota && nota< 65) shadow = "var(--box-shadow1)"

        else if(nota === null && indice < 65) shadow = "var(--box-shadow1)"

        return shadow;
    }

    let colorNota = (nota: number): string =>{
        let defaultColor = "var(--passed)";

        if(nota < 65) defaultColor = "var(--failed)"

        return defaultColor
    }
    
    function getChartWidth(): number{
        let width: number;
        let materiasWidth: number = materias.length*40;

        if(materiasWidth < (window.innerWidth*0.90)){
            width = window.innerWidth*0.92;
        }else{
            width = materiasWidth;
        }

        return width;
    }

    const CustomTooltip = (props: any) => {
        if (props.active && props.payload) {
            let nota = props.payload[0].payload.Nota;
            let clase = props.payload[0].payload.Clase;
            let uv = props.payload[0].payload.UV;
            
          return (
            <div className="custom-tooltip" style={{boxShadow:colorShadow(nota)}}>
              <p className="label"><strong style={{color: colorNota(nota), textAlign: "center", textDecoration: 'underline'}}>{clase}</strong></p>
              <p className="intro">Nota: <strong style={{color: colorNota(nota)}}>{nota}</strong></p>
              <p className="desc">UV: <strong style={{color: colorNota(nota)}}>{uv}</strong></p>
            </div>
          );
        }
      
        return null;
      };

    /*const CustomDot = (props: any | null) =>{
        return <text x={props.x} y={props.y} dy={-4} fill={colorNota(props.value)} fontSize={10} textAnchor="middle">{props.value}</text>;
    }*/

    return (
        <div id="stats">
            <LineChart
                height={(window.innerHeight)*0.60}
                width={getChartWidth()}
                data={materias}
            >
                <CartesianGrid
                    strokeWidth={2}
                    strokeOpacity={10}
                    strokeDasharray="4 4"
                    stroke={"var(--chart-grid)"}
                />
                <Line
                    type="monotone"
                    dataKey="Nota"
                    stroke="var(--chart-mainLine)"
                    strokeWidth={4}
                    dot={
                        {
                            stroke: "var(--chart-dot)",
                            strokeWidth: 3
                        }
                    }
                >
                </Line>
                <Tooltip
                    content={<CustomTooltip/>}
                />
                <ReferenceLine y={65} stroke="var(--failed)" strokeDasharray={"3 3"} strokeWidth={2}>
                    <Label
                        value={labelRPB}
                        position={'insideBottomLeft'}
                        fontSize={"0.85em"}
                        //fontWeight={"bold"}
                        stroke={"var(--chart-axis)"}
                    />
                </ReferenceLine>
                <ReferenceLine
                    y={indice}
                    stroke={colorIndice}
                    strokeWidth={2}
                >
                    <Label
                        value={labelIndice}
                        position={'insideBottomLeft'}
                        fontSize={"0.85em"}
                        //fontWeight={"bold"}
                        stroke={"var(--chart-axis)"}
                    />
                </ReferenceLine>
                <YAxis
                stroke={"var(--chart-axis)"}
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                tick={{fontSize: "0.81em", fontWeight: "bold", fontFamily: "'Poppins', sans-serif"}}
                interval={0}
                padding={{
                    top: 25
                }}
                strokeWidth={3}
                />
                <XAxis
                    stroke={"var(--chart-axis)"}
                    dataKey="Clase"
                    angle={-90}
                    height={80}
                    tick={{
                        fontSize: "0.81em",
                        fontWeight: "bold",
                        fontFamily: "'Poppins', sans-serif",
                        textAnchor: "end"
                    }}
                    dy={3}
                    dx={-3}
                    interval={0}
                    padding={{
                        left: 30,
                        right: 50
                    }}
                    strokeWidth={3}
                />
            </LineChart>
        </div>
    );
}
 
export default GraphMode;