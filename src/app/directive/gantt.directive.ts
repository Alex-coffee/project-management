import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { GanttItem } from 'app/model/gantt-item';
import { GanttSlot } from 'app/model/gantt-slot';
import { GanttDataSet } from 'app/model/ganttDataSet';
import * as d3 from "d3";
import * as dateFormat from "dateFormat";
declare var $:any;

@Directive({
  selector: '[appGanttDirective]'
})
export class GanttDirective implements OnChanges, OnInit{
  @Input() private ganttDataSet: GanttDataSet;

  slotMap: any = {};

  scenarioStartTime: number;
  scenarioEndTime: number;

  ganttSettings: any = {};

  // defaultTimeUnit = 60 * 60 * 1000; // 1 hour
  defaultTimeUnit = 30 * 60 * 1000; // half hour

  slotContainerWidth = 150;
  blockSize = 40;
  defaultTimeUnitSize = 10;
  // blockScale = 0.25; //  1/4 hour
  blockScale = 3; //  3 hour
  // blockScaleArray = [0.25, 0.5, 1, 2, 3, 6, 12, 24];
  blockScaleArray = [
      {scale: 0.25, label: "15分钟"},
      {scale: 0.5, label: "半小时"},
      {scale: 1, label: "1小时"},
      {scale: 2, label: "2小时"},
      {scale: 3, label: "3小时"},
      {scale: 6, label: "6小时"},
      {scale: 12, label: "半天"},
      {scale: 24, label: "1天"}
    ];

  constructor(private el: ElementRef) { this.setBlockScale(3);}

  ngOnInit():any {
    this.createStructure();
  }

  ngOnChanges(changes:SimpleChanges) {

    if(this.ganttDataSet){
      this.drawGantt();
    }
  }
  drawGantt(){
      this.processData();
      this.buildSlot();
      this.buildTimeline();
      this.buildGantt();
      this.setBlockScale(undefined);
  }

  setBlockScale(scale: any){
    if(scale){
      this.blockScale = scale;
    }
    $("#scaleSelector").val(this.blockScale);
  }

  //***************** build the elements that we need in page *****************
  createStructure(){
    let rootContainer = $("<div>", {"class": "ganttRoot"});
    let timelineContainer = $("<div>", {"id": "timelineContainer", "class": "timelineContainer"});
    timelineContainer.height(this.blockSize);

    let timelineInner = $("<div>", {"id": "timelineInner"});
    timelineInner.css({
      height: this.blockSize,
      "margin-left": this.slotContainerWidth
    })

    var timelineSvg = document.createElementNS ("http://www.w3.org/2000/svg", "svg");
    timelineSvg.setAttribute("id", "timelineSvg");
    timelineSvg.style.display = "block";
    timelineInner.append($(timelineSvg));

    timelineContainer.append(timelineInner);
    rootContainer.append(timelineContainer);

    let slotContainer = $("<div>", {"id": "slotContainer", "class": "slotContainer"});
    let slotInner = $("<div>", {"id": "slotInner","class": "slotInner"});
    slotInner.height(1000);
    slotContainer.append(slotInner);
    slotContainer.css({
      top: this.blockSize,
      width: this.slotContainerWidth
    });
    rootContainer.append(slotContainer);

    let ganttContainer = $("<div>", {"id": "ganttContainer", "class": "ganttContainer"});
    let bg = $("<div>", {"class": "ganttBG"});
    ganttContainer.append(bg);
    
    var svgElem = document.createElementNS ("http://www.w3.org/2000/svg", "svg");
    svgElem.setAttribute("id", "svgContainer");
    svgElem.style.display = "block";

    ganttContainer.append($(svgElem));
    ganttContainer.css({
      "margin-left": this.slotContainerWidth
    });
    rootContainer.append(ganttContainer);

    $(this.el.nativeElement).append(rootContainer);

    //set some width after the rootContainer being appened to dom
    $("#ganttContainer").scroll(function () { 
       $("#slotContainer").animate({
          scrollTop: $("#ganttContainer").scrollTop()
        }, 0);

        $("#timelineInner").animate({
          scrollLeft: $("#ganttContainer").scrollLeft()
        }, 0);
    });

    //set the toolBar
    let scaleSelectorContainer = $("<div>", {"class": "pull-right"});
    scaleSelectorContainer.text("时间轴比例")
    let scaleSelector = $("<select>", {"id": "scaleSelector", "class": "m-l-sm"});
    this.blockScaleArray.forEach(blockScale => {
      let scaleOption = $("<option>", {"value": blockScale.scale});
      scaleOption.html(blockScale.label);
      scaleSelector.append(scaleOption);
    })
    scaleSelectorContainer.append(scaleSelector)
    $("#toolBar").append(scaleSelectorContainer);
    $("#scaleSelector").change(val => {
      this.blockScale = parseFloat($("#scaleSelector").val());
      this.drawGantt();
    });

  }

  //***************** data process **********************
  processData(){
    //sort the process id
    this.ganttDataSet.ganttSlots.sort((a, b) =>{
      return a.id - b.id
    })

    this.ganttDataSet.ganttSlots.forEach(element => {
      this.slotMap[element.id] = element;
    });

    this.scenarioStartTime = this.ganttDataSet.startTime;

    let diffDays = this.getCeilDiffDays(this.ganttDataSet.endTime, this.ganttDataSet.startTime);
    let totalBlock = diffDays * 24 / this.blockScale;
    let blockTimeLenth = this.blockScale * 60 / this.blockSize;

    this.ganttSettings.totalBlock = totalBlock;
    this.ganttSettings.blockTimeLenth = blockTimeLenth;

    console.log(this.slotMap);
  }

  //*************** relevant to timeline ***************
  buildTimeline(){
    let that = this;
    let timelineArray = [];
	  for(let i = 0; i < this.ganttSettings.totalBlock; i++){
      let linePosition = this.blockSize * i;
      const currenTime = this.scenarioStartTime + this.ganttSettings.blockTimeLenth * 60 * 1000 * linePosition;

      for(let scaleNo = 0; scaleNo < 4; scaleNo++){
        let shortLineOffset = this.blockSize / 4 * scaleNo;

        timelineArray.push({
          x: linePosition + shortLineOffset,
          time: currenTime
        })
      }
	  }

    d3.selectAll("#timelineSvg > *").remove();
    let svg = d3.select("#timelineSvg");
    svg.selectAll("line.tItem").data(timelineArray)
      .enter()
      .append("line")
      .attr("class", "tItem")
      .attr("x1", function(d){
        return d.x;
      })
      .attr("y1", function(d){
        return that.blockSize;
      })
      .attr("x2", function(d){
        return d.x;
      })
      .attr("y2", function(d){
        if(d.x % that.blockSize == 0){
          return that.blockSize - 10;
        }else{
          return that.blockSize - 5;
        }
      })
      ;

    svg.selectAll("text.textTime").data(timelineArray)
      .enter()
      .filter(function(d){
        return d.x % (that.blockSize * 5) == 0;
      })
      .append("text")
      .attr("class", "textTime")
      .text(function(d){
        return dateFormat(d.time, "yyyy-mm-dd HH:MM");
      })
      .attr("x", function(d){
        return d.x;
      })
      .attr("y", function(d){
        return 10;
      })
      ;

  }

  //*************** relevant to slot ***************

  buildSlot(){
    $("#slotInner").html("");

    let that = this;
    this.ganttDataSet.ganttSlots.forEach(slot =>{
      let slotItem = $("<div>", {"class": "slotItem"});
      slotItem.height(that.blockSize);
      slotItem.text(slot.label);
      $("#slotInner").append(slotItem);
    })

    $("#slotInner").height(this.blockSize * this.ganttDataSet.ganttSlots.length);
  }


  //*************** relevant to gantt *****************
  buildGantt(){
    let ganttItems = this.ganttDataSet.ganttItems;
    let that = this;
    d3.selectAll("#svgContainer > *").remove();
    let svg = d3.select("#svgContainer"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    //{"earlistFinishTime":5,"earlistStartTime":0,"isCritical":true,"latestFinishTime":15,"latestStartTime":10,"processId":0}

    let ganttNodes = svg.selectAll("g.ganttNodes").data(ganttItems)
      .enter()
      .append("g")
      .attr("class", "ganttNodes");

      ganttNodes.append("rect")
        .attr("class", "ganttItem")
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("x", function(d){
          return that.getItemLeft(d.startTime);
        })
        .attr("y", function(d){
          return that.blockSize * d.rowIndex + 4;
        })
        .attr("width", function(d){
          return that.getItemWidth(d.endTime, d.startTime);
        })
        .attr("height", function(d){
          return that.blockSize - 8;
        })

      ganttNodes.append("text")
        .attr("x", function(d){
          return that.getItemLeft(d.startTime);
        })
        .attr("y", function(d){
          return that.blockSize * d.rowIndex + 14;
        })
        .text(function(d){
          return d.label;
        })
        .attr("transform", function(d){
          let offset = that.getItemWidth(d.endTime, d.startTime) / 2 - this.getComputedTextLength() / 2
          return "translate(" + offset + ",0)" ;
        })

      ganttNodes.append("text")
        .attr("x", function(d){
          return that.getItemLeft(d.startTime);
        })
        .attr("y", function(d){
          return that.blockSize * d.rowIndex + 25;
        })
        .text(function(d){
          return "第" + d.content.time + "天, 数量: " + d.content.amount;
        })
        .attr("transform", function(d){
          let offset = that.getItemWidth(d.endTime, d.startTime) / 2 - this.getComputedTextLength() / 2
          return "translate(" + offset + ",0)" ;
        })

    
    $("#svgContainer, .ganttBG").css({
      width: this.blockSize * this.ganttSettings.totalBlock,
      height: this.blockSize * this.ganttDataSet.ganttSlots.length
    });
    
    $("#timelineSvg").css({
      width: this.blockSize * this.ganttSettings.totalBlock,
      height: this.blockSize
    });
  }



  //**************** Utils *****************/
  getItemWidth(toTime, fromTime){
    return this.getTotalDiffMinutes(toTime, fromTime) 
      / this.ganttSettings.blockTimeLenth;
  }

  getItemLeft(fromTime){
    return this.getTotalDiffMinutes(fromTime, this.scenarioStartTime) 
      / this.ganttSettings.blockTimeLenth;
  }

  getTimeMiliFromToday(inputTime){
      return new Date().getTime() + inputTime * this.defaultTimeUnit;
  }

  getCeilDiffDays(time1, time2){
		return Math.ceil((time1 - time2) / (24*3600*1000));
	}
	getDiffDays(time1, time2){
		return Math.floor((time1 - time2) / (24*3600*1000));
	}
	getDiffHours(time1, time2){
		return Math.floor((time1 - time2) % (24*3600*1000) / (3600*1000));
	}
	getDiffMinutes(time1, time2){
		return Math.floor((time1 - time2) % (24*3600*1000) % (3600*1000) / (60*1000));
	}
	getTotalDiffMinutes(time1, time2){
		if(time1 > time2){
			return this.getDiffDays(time1, time2) * 24 * 60 + this.getDiffHours(time1, time2) * 60 + this.getDiffMinutes(time1, time2);
		}else{
			return -(this.getDiffDays(time2, time1) * 24 * 60 + this.getDiffHours(time2, time1) * 60 + this.getDiffMinutes(time2, time1));
		}
	}

}
