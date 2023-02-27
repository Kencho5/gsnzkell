import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './search.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss', '../responsive.css']
})
export class SearchComponent implements OnInit {
  posts = [];
  postsLength;
  text: string;
  count;
  time;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageEvent: PageEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    const bars = this.el.nativeElement.querySelector('.bars');
    const sidebar = this.el.nativeElement.querySelector('#Profile-sidebar');

    this.renderer.listen(bars, 'click', () => {
      sidebar.classList.toggle('active');
    });

    this.text = this.activatedRoute.snapshot.paramMap.get("text");
    
    this.searchService.searchPost({text: this.text}).subscribe((res) => {
      if (res["code"] == 200) {
        this.posts = res['data'];
        this.count = res['count'];
        this.time = res['time'];
        console.log(this.posts)
      }
    });
  }

  openPost(id) {
    window.open(`/post/${id}`)
  }


}
