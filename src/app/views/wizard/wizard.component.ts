import { Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
  @ViewChild('formWizard') public formWizard;
  @ViewChild('parameter') public parameter;

  showPlanConent = false;
  showConfigConent = false;
  showORConent = false;
  showResultConent = false;

  constructor() { }

  ngOnInit() {
  }

  public next(itemToShow){
    if ('plan' === itemToShow) {
      this.showPlanConent = true;
    } else if ('config' === itemToShow) {
      this.showConfigConent = true;
    } else if ('or' === itemToShow) {
      this.showORConent = true;
    } else if ('result' === itemToShow) {
      this.showResultConent = true;
    }

    this.formWizard.next();
  }

  public runOR() {
    // this.parameter.runOR();
    this.showResultConent = true;
    this.formWizard.next();
  }
}
