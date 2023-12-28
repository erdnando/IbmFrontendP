export interface ReporteHorasTLS {
    tool: string;
    weekDaysTls: WeekDaysTls[];
    nivel: number;
  }
  export interface WeekDaysTls {
    fecha: string;
    totalHoras: number;
  }
  export interface ReqRepHorasTLS {
    semana: number;
    usuario: string;
  }
  
  export interface RepGralHoras {
    tool: string;
    dia1: string;
    dia2: string;
    dia3: string;
    dia4: string;
    dia5: string;
    dia6: string;
    dia7: string;
  }
  
  