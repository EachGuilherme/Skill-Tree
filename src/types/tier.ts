export interface TierInfo {
  numero: number;
  nome: string;
  descricao: string;
  requisitos: {
    stats?: {
      STR?: number;
      DEX?: number;
      CON?: number;
      WIL?: number;
      MND?: number;
      SPI?: number;
    };
    tpMinimo?: number;
    tiers_anteriores?: number[];
  };
}

export interface ProgressoTier {
  numero: number;
  total: number;
  desbloqueadas: number;
  percentual: number;
}