import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActuariesService } from '../../../services/actuaries.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-bank-profit',
  templateUrl: './bank-profit.component.html',
  styleUrls: ['./bank-profit.component.css'],
  imports: [
    NgIf
  ],
  standalone: true
})
export class BankProfitComponent implements OnInit, OnDestroy {
  bankProfit: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private actuariesService: ActuariesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isSupervisor() && !this.authService.isAdmin()) {
      this.errorMessage = "Access denied. Only supervisors and admins can access this portal.";
      return;
    }
    this.loadBankProfit();
  }

  loadBankProfit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.actuariesService.getBankProfit()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profit: number) => {
          this.bankProfit = profit;
          this.loading = false;
        },
        error: (err) => {
          console.error("Error loading bank profit", err);
          this.errorMessage = "Failed to load bank profit. Please try again later.";
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
