import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllService } from './all.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent {
  animal: string;
  posts = [];
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private allService: AllService) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.animal = params['animal'];

      this.getAll();
    });
  }

  getAll() {
    this.allService.getPosts({ animal: this.animal }).subscribe((res) => {
      if (res['code'] == 200) {
        this.posts = res['posts'];
      }
    });
  }
}
