import { Component, OnInit } from '@angular/core';
import { Share } from 'src/app/logic/data-models/data-models';
import { ShareService } from 'src/app/logic/services/share.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
  public shareArray: Array<Share>;

  constructor(private shareService: ShareService) { }

  ngOnInit(): void {
    this.shareService.getAllShares({}).subscribe(shares => this.shareArray = shares);
  }
}
