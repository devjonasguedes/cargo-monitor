import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {Tracking, TrackingByDriver, TrackingByStatus} from '../../@types/tracking';
import { TrackingService } from '../../services/tracking.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'cargo-list',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButton,
    MatIcon,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'Documento',
    'Motorista',
    'Origem',
    'Destino',
    'Status',
  ];

  tracking = new MatTableDataSource<Tracking>([]);
  trackingByDriver: TrackingByDriver[] = [];
  trackingByStatus: TrackingByStatus[] = [];

  driverFilter = new FormControl('');
  statusFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.trackingService.getAll().subscribe((trackingData) => {
      this.tracking.data = trackingData;
      this.tracking.paginator = this.paginator;
      this.trackingByDriver = this.trackingService.groupedByDriver(trackingData);
      this.trackingByStatus = this.trackingService.groupedByStatus(trackingData);
    });

    this.driverFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.statusFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const driver = this.driverFilter.value;
    const status = this.statusFilter.value;

    this.tracking.data = this.trackingService.trackingData.filter((data) => {
      return (
        (!driver || data.motorista.nome === driver) &&
        (!status || data.status_entrega === status)
      );
    });
  }
}
