import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import { Tracking } from '../../@types/tracking';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatTableModule,
} from '@angular/material/table';

@Component({
  selector: 'cargo-dashboard',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatTableModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  trackingByDriver: Tracking[] = [];
  trackingByNeiborhood: Tracking[] = [];

  displayedDriverColumns: string[] = [
    'Nome',
    'Entregas',
    'Entregas Realizadas',
  ];
  displayedFailureColumns: string[] = ['Nome', 'Não completadas'];
  displayedNeiborhoodColumns: string[] = ['Nome', 'Entregas', 'Completadas'];

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.trackingService.getAll().subscribe((trackingData) => {
      this.trackingByDriver = this.trackingService.groupedByDriver(trackingData);
      this.trackingByNeiborhood = this.trackingService.groupedByNeighborhood(trackingData);
    });
  }
}
