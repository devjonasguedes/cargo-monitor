export interface Tracking {
  id: string;
  documento: string;
  motorista: {
    nome: string;
  };
  cliente_origem: {
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
  };
  cliente_destino: {
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
  };
  status_entrega: string;
}

export interface TrackingByDriver {
  deliveriesCompleted: number;
  deliveriesFailure: number;
  deliveriesPending: number;
  name: string;
}

export interface TrackingByStatus {
  trackings: Tracking[];
  name: string;
}
