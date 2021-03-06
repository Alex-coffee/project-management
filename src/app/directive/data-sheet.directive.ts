import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[appDataSheet]'
})
export class DataSheetDirective implements OnChanges, OnInit{
  @Input() private sheetContent: any;
  @Input() private dateRange: Date[];

  constructor(private el: ElementRef) { }

  ngOnInit(): any {}

  ngOnChanges(changes: SimpleChanges) {

    if (this.sheetContent && this.dateRange) {
      console.log('sheetContent: ' + this.sheetContent);
      console.log('dateRange: ' + this.dateRange);
      this.buildDataSheet();
    }
  }

  buildDataSheet() {
    this.buildStructure();
  }

  buildStructure() {
    const rootContainer = $('<div>', {'class': 'dataSheet'});
    const frameWidth = $(this.el.nativeElement).width();

    const slotContainer = $('<div>', {'class': 'slotContainer'});
    const contentContainer = $('<div>', {'class': 'contentContainer'});

    rootContainer.append(slotContainer);
    rootContainer.append(contentContainer);

    // rootContainer.text(123);
    $(this.el.nativeElement).append(rootContainer);
  }
}
