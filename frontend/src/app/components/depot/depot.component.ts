import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControlsMap, Depot } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.scss']
})
export class DepotComponent implements OnInit {
  public depotForm: FormGroup;
  public error: boolean = false;

  public depotArray: Array<Depot> = [];

  constructor(private depotService: DepotService) { }

  ngOnInit(): void {
    this.depotService.getAllDepotsBySession().subscribe(depots => {
      this.depotArray = depots;
    });
    this.createForm();
  }

  public createForm(): void {
    this.depotForm = new FormGroup({
      depotName: new FormControl('', [Validators.required]),
      depotDescription: new FormControl('', [Validators.required])
    });
  }
  public get depotValue(): ControlsMap<AbstractControl> {
    return this.depotForm.controls;
  }
  public onDepotSubmit(): void {
    this.depotService.createDepot(this.depotValue).subscribe(
      (data) => {
        console.log(data);
        this.error = false;
      },
      (error) => {
        this.error = true;
      }
    );
  }


}
