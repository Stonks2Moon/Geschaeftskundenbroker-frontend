import { Component, OnInit } from '@angular/core';
import { Depot } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.scss']
})
export class DepotComponent implements OnInit {

  public depotArray: Array<Depot> = [];

  constructor(private depotService: DepotService) { }

  ngOnInit(): void {
    this.depotService.getAllDepotsBySession().subscribe(depots => {
      this.depotArray = depots;
    });
  }

}
