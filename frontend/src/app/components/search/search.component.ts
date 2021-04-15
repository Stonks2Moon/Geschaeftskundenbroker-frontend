import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from 'src/app/logic/data-models/data-models';
import { ShareService } from 'src/app/logic/services/share.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public shareArray: Array<Share>;
  public error: boolean = false;

  private query: string;

  constructor(private router: Router, private route: ActivatedRoute, private shareService: ShareService,) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.query = this.route.snapshot.paramMap.get('query');
    this.getSearchResult();
  }

  private getSearchResult(): void {
    this.shareService.getAllShares({ search: this.query }).subscribe(
      (data) => {
        this.shareArray = data;
        this.error = false;
        return data;
      },
      (error) => {
        this.error = true;
      }
    )
  }


}
