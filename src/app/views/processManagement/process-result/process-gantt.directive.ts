import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from "d3";
import * as dateFormat from "dateFormat";
declare var $:any;

@Directive({
  selector: '[appProcessGantt]'
})
export class ProcessGanttDirective implements OnChanges, OnInit{
  @Input() private dataSet: any[];
  @Input() private slotSet: any[];

  slotMap: any = {};
  slotArray: any[] = [];

  scenarioStartTime: number;
  scenarioEndTime: number;

  ganttSettings: any = {};

  // defaultTimeUnit = 60 * 60 * 1000; // 1 hour
  defaultTimeUnit = 30 * 60 * 1000; // half hour

  slotContainerWidth = 150;
  blockSize = 40;
  defaultTimeUnitSize = 10;
  blockScale = 0.25; //  1/4 hour

  constructor(private el: ElementRef) { }

  ngOnInit():any {
    this.createStructure();
  }

  ngOnChanges(changes:SimpleChanges) {
    if(this.dataSet.length > 0 && this.slotSet.length > 0){
      this.processData();
      this.buildSlot();
      this.buildTimeline();
      this.buildGantt(this.dataSet);
    }
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
  }

  //***************** data process **********************
  processData(){
    //sort the process id
    this.slotSet.sort((a, b) =>{
      return a.processId - b.processId
    })

    this.slotSet.forEach(element => {
      this.slotMap[element.processId] = element;
      this.slotArray.push(element.processId);
    });

    this.scenarioStartTime = 
      this.getTimeMiliFromToday(d3.min(this.dataSet, function(d) { return d.earlistStartTime; }));
    this.scenarioEndTime = 
      this.getTimeMiliFromToday(d3.max(this.dataSet, function(d) { return d.latestFinishTime; }));

    let diffDays = this.getCeilDiffDays(this.scenarioEndTime, this.scenarioStartTime);
    let totalBlock = diffDays * 24 / this.blockScale;
    let blockTimeLenth = this.blockScale * 60 / this.blockSize;

    this.ganttSettings.totalBlock = totalBlock;
    this.ganttSettings.blockTimeLenth = blockTimeLenth;

    console.log(this.slotMap);
    console.log(this.slotArray);
    
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

    let svg = d3.select("#timelineSvg");
    svg.selectAll("line.tItem").data(timelineArray)
      .enter()
      .append("line")
      .attr("class", "tItem")
      .attr("stroke", "#ccc")
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
  getSlotDetail(id){
    const detailInfo = {
      index: this.slotArray.indexOf(id),
      name: this.slotMap[id].name
    }
    return detailInfo;
  }

  buildSlot(){
    let that = this;
    this.slotArray.forEach(slot =>{
      let slotItem = $("<div>", {"class": "slotItem"});
      slotItem.height(that.blockSize);
      slotItem.text(slot);
      $("#slotInner").append(slotItem);
    })

    $("#slotInner").height(this.blockSize * this.slotArray.length);
  }


  //*************** relevant to gantt *****************
  buildGantt(dataSet){
    let that = this;
    let svg = d3.select("#svgContainer"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    //{"earlistFinishTime":5,"earlistStartTime":0,"isCritical":true,"latestFinishTime":15,"latestStartTime":10,"processId":0}

    let ganttNodes = svg.selectAll("g.ganttNodes").data(this.dataSet)
      .enter()
      .append("g")
      .attr("class", "ganttNodes");

      ganttNodes.append("rect")
        .attr("class", "ganttItem")
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("x", function(d){
          return that.getItemLeft(d.earlistStartTime);
        })
        .attr("y", function(d){
          return that.blockSize * that.getSlotDetail(d.processId).index + 4;
        })
        .attr("width", function(d){
          return that.getItemWidth(d.latestFinishTime, d.earlistStartTime);
        })
        .attr("height", function(d){
          return that.blockSize - 8;
        })

      // ganttNodes.append("line")
      //   .attr("x1", function(d){
      //     return d.earlistFinishTime * that.blockSize;
      //   })
      //   .attr("y1", function(d){
      //     return that.blockSize * that.getSlotDetail(d.processId).index + 2;
      //   })
      //   .attr("x2", function(d){
      //     return d.earlistFinishTime * that.blockSize;
      //   })
      //   .attr("y2", function(d){
      //     return that.blockSize * that.getSlotDetail(d.processId).index ++ - 2;
      //   })
      //   .attr("stroke", "red")
    
    $("#svgContainer, .ganttBG").css({
      width: this.blockSize * this.ganttSettings.totalBlock,
      height: this.blockSize * this.slotArray.length
    });
    
    $("#timelineSvg").css({
      width: this.blockSize * this.ganttSettings.totalBlock,
      height: this.blockSize
    });
  }



  //**************** Utils *****************/
  getItemWidth(toTime, fromTime){
    return this.getTotalDiffMinutes(this.getTimeMiliFromToday(toTime), this.getTimeMiliFromToday(fromTime)) 
      / this.ganttSettings.blockTimeLenth;
  }

  getItemLeft(fromTime){
    return this.getTotalDiffMinutes(this.getTimeMiliFromToday(fromTime), this.scenarioStartTime) 
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
