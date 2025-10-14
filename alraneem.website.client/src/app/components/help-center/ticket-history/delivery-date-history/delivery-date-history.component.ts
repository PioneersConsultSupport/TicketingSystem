import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TicketHistory } from 'src/app/models/ticket-history';
import { TicketHistoryService } from 'src/app/services/ticket-history.service';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';

@Component({
  selector: 'app-delivery-date-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslatePipe],
  templateUrl: './delivery-date-history.component.html',
  styleUrls: ['./delivery-date-history.component.scss'],
})
export class DeliveryDateHistoryComponent implements OnChanges {
  @Input() ticketId?: number;
  deliveryDateHistories: TicketHistory[] = [];
  loading = false;

  constructor(private ticketHistoryService: TicketHistoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticketId'] && this.ticketId) {
      this.loadDeliveryDateHistory();
    }
  }

  loadDeliveryDateHistory() {
    if (!this.ticketId) return;
    this.loading = true;

    this.ticketHistoryService
      .getTicketHistoryByTicketId(this.ticketId)
      .subscribe({
        next: (res) => {
          this.deliveryDateHistories = res
            .map((h) => ({
              ...h,
              historyDetails: h.historyDetails.filter((d) =>
                d.includes('Delivery Date'),
              ),
            }))
            .filter((h) => h.historyDetails.length > 0)
            .sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime(),
            );

          this.loading = false;
        },
        error: () => {
          this.deliveryDateHistories = [];
          this.loading = false;
        },
      });
  }
}
