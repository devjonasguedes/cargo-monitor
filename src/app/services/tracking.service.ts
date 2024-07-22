import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Tracking } from '../@types/tracking';

const apiUrl = 'http://localhost:3000/data';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(private http: HttpClient) {}

  trackingData: Tracking[] = [];

  getAll(): Observable<Tracking[]> {
    return this.http
      .get<Tracking[]>(apiUrl)
      .pipe(tap((tracking) => (this.trackingData = tracking)));
  }

  groupedByDriver(data: Tracking[]): any {
    const groupByDriver = data.reduce((acc: any, tracking: Tracking) => {
      const driverName = tracking.motorista.nome;
      if (!acc[driverName]) {
        acc[driverName] = [];
      }
      acc[driverName].push(tracking);
      return acc;
    }, {});

    return Object.keys(groupByDriver).map((driverName) => {
      const driverTracking = groupByDriver[driverName] as Tracking[];

      const completed = driverTracking.filter(
        (driver) => driver.status_entrega === 'ENTREGUE',
      );
      const pending = driverTracking.filter(
        (driver) => driver.status_entrega === 'PENDENTE',
      );
      const failure = driverTracking.filter(
        (driver) => driver.status_entrega === 'INSUCESSO',
      );

      return {
        name: driverName,
        deliveriesPending: pending.length,
        deliveriesCompleted: completed.length,
        deliveriesFailure: failure.length,
      };
    });
  }

  groupedByNeighborhood(data: Tracking[]): any {
    const group = data.reduce((acc: any, tracking: Tracking) => {
      const neiborhood = tracking.cliente_destino.bairro;
      if (!acc[neiborhood]) {
        acc[neiborhood] = [];
      }
      acc[neiborhood].push(tracking);
      return acc;
    }, {});

    return Object.keys(group).map((neiborhood) => {
      const neiborTracking = group[neiborhood] as Tracking[];

      const completed = neiborTracking.filter(
        (neibor) => neibor.status_entrega === 'ENTREGUE',
      );

      return {
        name: neiborhood,
        deliveries: neiborTracking.length,
        deliveriesCompleted: completed.length,
      };
    });
  }

  groupedByStatus(data: Tracking[]): any {
    const group = data.reduce((acc: any, tracking: Tracking) => {
      const status = tracking.status_entrega;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(tracking);
      return acc;
    }, {});

    return Object.keys(group).map((status) => {
      const statusTracking = group[status] as Tracking[];

      return {
        name: status,
        trackings: statusTracking,
      };
    });
  }
}
