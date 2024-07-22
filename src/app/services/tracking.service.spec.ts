import { TestBed } from '@angular/core/testing';
import { TrackingService } from './tracking.service';
import {
  HttpClient,
} from '@angular/common/http';
import { Tracking } from '../@types/tracking';
import { defer } from 'rxjs';

let httpClientSpy: jasmine.SpyObj<HttpClient>;

describe('TrackingService', () => {
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    trackingService = new TrackingService(httpClientSpy);
  });

  it('should return expected trackings', (done: DoneFn) => {
    const expectedTrackings: Tracking[] = [
      {
        id: '1',
        documento: '01021',
        motorista: {
          nome: 'Carlos Pereira',
        },
        cliente_origem: {
          nome: 'Empresa ABC',
          endereco: 'Rua dos Pinheiros, 789',
          bairro: 'Jardins',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Ana Clara',
          endereco: 'Rua Vergueiro, 1234',
          bairro: 'Liberdade',
          cidade: 'São Paulo',
        },
        status_entrega: 'ENTREGUE',
      },
    ];
    httpClientSpy.get.and.returnValue(asyncData(expectedTrackings));
    trackingService.getAll().subscribe({
      next: (trackings) => {
        expect(trackings).withContext('trackings').toEqual(expectedTrackings);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('trackings').toBe(1);
  });

  it('should return tracking by drivers', () => {
    const trackingData: Tracking[] = [
      {
        id: '1',
        documento: '01021',
        motorista: { nome: 'Carlos Pereira' },
        cliente_origem: {
          nome: 'Empresa ABC',
          endereco: 'Rua dos Pinheiros, 789',
          bairro: 'Jardins',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Ana Clara',
          endereco: 'Rua Vergueiro, 1234',
          bairro: 'Liberdade',
          cidade: 'São Paulo',
        },
        status_entrega: 'ENTREGUE',
      },
      {
        id: '2',
        documento: '01022',
        motorista: { nome: 'Carlos Pereira' },
        cliente_origem: {
          nome: 'Empresa DEF',
          endereco: 'Av. Paulista, 1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'João Silva',
          endereco: 'Rua Augusta, 500',
          bairro: 'Consolação',
          cidade: 'São Paulo',
        },
        status_entrega: 'PENDENTE',
      },
      {
        id: '3',
        documento: '01023',
        motorista: { nome: 'Ana Santos' },
        cliente_origem: {
          nome: 'Empresa GHI',
          endereco: 'Rua da Consolação, 300',
          bairro: 'Consolação',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Maria Oliveira',
          endereco: 'Av. Ipiranga, 700',
          bairro: 'Centro',
          cidade: 'São Paulo',
        },
        status_entrega: 'INSUCESSO',
      },
    ];

    const grouped = trackingService.groupedByDriver(trackingData);
    expect(grouped).toEqual([
      {
        name: 'Carlos Pereira',
        deliveriesPending: 1,
        deliveriesCompleted: 1,
        deliveriesFailure: 0,
      },
      {
        name: 'Ana Santos',
        deliveriesPending: 0,
        deliveriesCompleted: 0,
        deliveriesFailure: 1,
      },
    ]);
  });

  it('should return tracking by neighborhood', () => {
    const trackingData: Tracking[] = [
      {
        id: '1',
        documento: '01021',
        motorista: { nome: 'Carlos Pereira' },
        cliente_origem: {
          nome: 'Empresa ABC',
          endereco: 'Rua dos Pinheiros, 789',
          bairro: 'Jardins',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Ana Clara',
          endereco: 'Rua Vergueiro, 1234',
          bairro: 'Liberdade',
          cidade: 'São Paulo',
        },
        status_entrega: 'ENTREGUE',
      },
      {
        id: '2',
        documento: '01022',
        motorista: { nome: 'Carlos Pereira' },
        cliente_origem: {
          nome: 'Empresa DEF',
          endereco: 'Av. Paulista, 1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'João Silva',
          endereco: 'Rua Augusta, 500',
          bairro: 'Consolação',
          cidade: 'São Paulo',
        },
        status_entrega: 'PENDENTE',
      },
      {
        id: '3',
        documento: '01023',
        motorista: { nome: 'Ana Santos' },
        cliente_origem: {
          nome: 'Empresa GHI',
          endereco: 'Rua da Consolação, 300',
          bairro: 'Consolação',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Maria Oliveira',
          endereco: 'Av. Ipiranga, 700',
          bairro: 'Centro',
          cidade: 'São Paulo',
        },
        status_entrega: 'INSUCESSO',
      },
    ];

    const grouped = trackingService.groupedByNeighborhood(trackingData);
    expect(grouped).toEqual([
      {
        name: 'Liberdade',
        deliveries: 1,
        deliveriesCompleted: 1,
      },
      {
        name: 'Consolação',
        deliveries: 1,
        deliveriesCompleted: 0,
      },
      {
        name: 'Centro',
        deliveries: 1,
        deliveriesCompleted: 0,
      },
    ]);
  });

  it('should return tracking grouped by status', () => {
    const trackingData: Tracking[] = [
      {
        id: '1',
        documento: '01021',
        motorista: { nome: 'Carlos Pereira' },
        cliente_origem: {
          nome: 'Empresa ABC',
          endereco: 'Rua dos Pinheiros, 789',
          bairro: 'Jardins',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Ana Clara',
          endereco: 'Rua Vergueiro, 1234',
          bairro: 'Liberdade',
          cidade: 'São Paulo',
        },
        status_entrega: 'ENTREGUE',
      },
      {
        id: '2',
        documento: '01022',
        motorista: { nome: 'Carlos Pereira' },
        cliente_origem: {
          nome: 'Empresa DEF',
          endereco: 'Av. Paulista, 1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'João Silva',
          endereco: 'Rua Augusta, 500',
          bairro: 'Consolação',
          cidade: 'São Paulo',
        },
        status_entrega: 'PENDENTE',
      },
      {
        id: '3',
        documento: '01023',
        motorista: { nome: 'Ana Santos' },
        cliente_origem: {
          nome: 'Empresa GHI',
          endereco: 'Rua da Consolação, 300',
          bairro: 'Consolação',
          cidade: 'São Paulo',
        },
        cliente_destino: {
          nome: 'Maria Oliveira',
          endereco: 'Av. Ipiranga, 700',
          bairro: 'Centro',
          cidade: 'São Paulo',
        },
        status_entrega: 'INSUCESSO',
      },
    ];

    const grouped = trackingService.groupedByStatus(trackingData);
    expect(grouped).toEqual([
      {
        name: 'ENTREGUE',
        trackings: [trackingData[0]],
      },
      {
        name: 'PENDENTE',
        trackings: [trackingData[1]],
      },
      {
        name: 'INSUCESSO',
        trackings: [trackingData[2]],
      },
    ]);
  });
});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
