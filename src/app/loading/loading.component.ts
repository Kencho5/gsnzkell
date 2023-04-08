import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 5px solid rgba(0, 0, 0, 0.1);
      border-top-color: #3498db;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingComponent {}
