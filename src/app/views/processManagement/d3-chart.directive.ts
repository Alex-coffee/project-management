import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from "d3";

@Directive({
  selector: '[appD3Chart]'
})
export class D3ChartDirective implements OnChanges, OnInit{

  @Input() private dataSet: any;
  private processChartData: any = {};
  private svgStatus: any = {};

  constructor(private el: ElementRef) { 
    // this.buildDemoChart();
    console.log(this.dataSet);
  }

  public ngOnInit():any {
    if (this.dataSet) {
      console.log(this.dataSet);
    }
  }

  public ngOnChanges(changes:SimpleChanges):void {
    if (this.dataSet && this.dataSet.length > 0) {
      // Check if the changes are in the datasets
      if (changes.hasOwnProperty('dataset')) {
        console.log(this.dataSet);
      } else {
        // Otherwise rebuild the chart
        // this.buildProcessChart(this.dataSet);
        this.buildProcessForceChart(this.dataSet);
      }
    }
  }

  buildChartDate(dataset){
    let svg = d3.select(this.el.nativeElement),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    let result = {
      nodes: [],
      links: []
    }

    if(dataset){
      result.nodes = dataset;
      if(result.nodes.length > 1){
        result.nodes[0].fixed = true;
        result.nodes[0].x = 0;
        result.nodes[0].y = 0;

        result.nodes[result.nodes.length - 1].fixed = true;
        result.nodes[result.nodes.length - 1].x = width ;
        result.nodes[result.nodes.length - 1].y = height;
      }

      dataset.forEach(element => {
        if(element.nextProcessVec){
          element.nextProcessVec.forEach(np => {
            result.links.push({
              source: element.processId,
              target: np.processId,
              name: element.name,
              time: element.time,
              order: element.order
            })
          })
        }
      });
      
    }
    return result;
  }

  buildProcessForceChart(dataset){
    let that = this;
    let svg = d3.select(this.el.nativeElement),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    let chartData = this.buildChartDate(dataset);
    console.log(chartData);

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    let simulation = d3.forceSimulation()
        .force("link", 
          d3.forceLink().id(function(d) {
           return d.processId; 
          })
          .distance(function(d) {
            return 150;
          })
          .strength(0.1)
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    let marker = svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")

      marker.append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");

    let linkGroup = svg.selectAll("g.lineGroup").data(chartData.links)
    let link = linkGroup.enter().append("g")
        .attr("class", "lineGroup")

    link.append("path")
        .attr("class", "netWorkLine")
        .attr("stroke-width", 1)
        .attr("stroke", "#333")
        .attr("marker-mid", "url(#arrow)")

    // link.append("text")
    //   .attr("x", -3)
    //   .attr("y", 3)
    //   .text(function(d){
    //     return d.time
    //   })

    let elem = svg.selectAll("g.processGroup").data(chartData.nodes)
    let node = elem.enter().append("g")
        .attr("class", "processGroup")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    node.append("circle")
      .attr("class", "process")
      .attr("r", 25)

    node.append("text")
      .attr("x", -15)
      .attr("y", 3)
      .text(function(d){
        return d.name + " " + d.time;
      })

    simulation
        .nodes(chartData.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(chartData.links);

    function ticked() {
      link.select("path.netWorkLine").attr("d", function(d){
        const midX = (d.source.x  + d.target.x) / 2;
        const midY = (d.source.y  + d.target.y) / 2;
        return "M" + d.source.x + "," + d.source.y + "L" + midX + "," + midY + "," + d.target.x + "," + d.target.y;
      })

      node.attr("transform", function(d) { 
        return 'translate(' + [d.x, d.y] + ')'; 
      });  
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  getTextLabelOffset(pointFrom, pointTo){
    let labelOffset = {x: 0, y: 0};
    if(pointFrom.y < pointTo.y){
      labelOffset.x = 10;
      labelOffset.y = -10;
    }else if(pointFrom.y > pointTo.y){
      labelOffset.x = -10;
      labelOffset.y = -10;
    }else{
      labelOffset.y = -10;
    }
    return labelOffset;
  }

}
