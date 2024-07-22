import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { HeaderComponent } from './header.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {ListComponent} from "./list.component";
import {HttpClient} from "@angular/common/http";
import {TrackingService} from "../../services/tracking.service";
import {asyncData} from "../../services/tracking.service.spec";
import {Tracking} from "../../@types/tracking";

let httpClientSpy: jasmine.SpyObj<HttpClient>;

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let trackingService: TrackingService;

  const mockTrackingData: Tracking[] = [
    {
      id: '1',
      documento: '01021',
      motorista: { nome: 'Carlos Pereira' },
      cliente_origem: { nome: 'Empresa ABC', endereco: 'Rua dos Pinheiros, 789', bairro: 'Jardins', cidade: 'São Paulo' },
      cliente_destino: { nome: 'Ana Clara', endereco: 'Rua Vergueiro, 1234', bairro: 'Liberdade', cidade: 'São Paulo' },
      status_entrega: 'ENTREGUE',
    },
    {
      id: '2',
      documento: '01022',
      motorista: { nome: 'Carlos Pereira' },
      cliente_origem: { nome: 'Empresa DEF', endereco: 'Av. Paulista, 1000', bairro: 'Bela Vista', cidade: 'São Paulo' },
      cliente_destino: { nome: 'João Silva', endereco: 'Rua Augusta, 500', bairro: 'Consolação', cidade: 'São Paulo' },
      status_entrega: 'PENDENTE',
    },
    {
      id: '3',
      documento: '01023',
      motorista: { nome: 'Ana Santos' },
      cliente_origem: { nome: 'Empresa GHI', endereco: 'Rua da Consolação, 300', bairro: 'Consolação', cidade: 'São Paulo' },
      cliente_destino: { nome: 'Maria Oliveira', endereco: 'Av. Ipiranga, 700', bairro: 'Centro', cidade: 'São Paulo' },
      status_entrega: 'INSUCESSO',
    },
  ];

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    trackingService = new TrackingService(httpClientSpy);

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
        { provide: TrackingService, useValue: httpClientSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tracking data on init', (done) => {
    httpClientSpy.get.and.returnValue(asyncData(mockTrackingData));

    trackingService.getAll().subscribe({
      next: (trackings) => {
        expect(trackings).withContext('trackings').toEqual(mockTrackingData);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get.calls.count()).withContext('trackings').toBe(1);
  });
});
