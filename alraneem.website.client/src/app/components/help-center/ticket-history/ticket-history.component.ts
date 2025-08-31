import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TicketHistory } from 'src/app/models/ticket-history';
import { TicketHistoryService } from 'src/app/Services/ticket-history.service';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';

@Component({
  selector: 'app-ticket-history',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './ticket-history.component.html',
  styleUrl: './ticket-history.component.scss',
})
export class TicketHistoryComponent implements OnChanges {
  @Input() ticketId?: number;
  ticketHistories: TicketHistory[] = [];
  loading: boolean = false;

  constructor(private ticketHistoryService: TicketHistoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticketId'] && this.ticketId) {
      this.loadHistory();
    }
  }

  loadHistory() {
    this.loading = true;
    if (!this.ticketId) return;
    this.ticketHistoryService
      .getTicketHistoryByTicketId(this.ticketId)
      .subscribe({
        next: (res) => {
          this.ticketHistories = res.sort(
            (a, b) =>
              new Date(b.createdAt!).getTime() -
              new Date(a.createdAt!).getTime()
          );
          this.loading = false;
        },
        error: () => {
          this.ticketHistories = [];
          this.loading = false;
        },
      });
  }
}
