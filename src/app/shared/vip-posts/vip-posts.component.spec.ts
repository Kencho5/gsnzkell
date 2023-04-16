import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipPostsComponent } from './vip-posts.component';

describe('VipPostsComponent', () => {
  let component: VipPostsComponent;
  let fixture: ComponentFixture<VipPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipPostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VipPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
