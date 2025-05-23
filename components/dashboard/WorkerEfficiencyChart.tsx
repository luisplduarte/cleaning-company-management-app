"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface WorkerEfficiencyChartProps {
  data: {
    name: string;
    totalJobs: number;
    completedJobs: number;
  }[];
}

export default function WorkerEfficiencyChart({ data }: WorkerEfficiencyChartProps) {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new("workerEfficiencyChart");

    // Remove amcharts logo
    root._logo?.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        paddingRight: 25
      })
    );

    // Create axes
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: am5xy.AxisRendererY.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    yAxis.data.setAll(data);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        min: 0
      })
    );

    // Create series for total jobs
    const totalSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Total Jobs",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "totalJobs",
        categoryYField: "name",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Total: {valueX}"
        })
      })
    );

    totalSeries.columns.template.setAll({
      fill: am5.color(0xff9800),
      strokeOpacity: 0
    });

    // Create series for completed jobs
    const completedSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Completed Jobs",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "completedJobs",
        categoryYField: "name",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Completed: {valueX}"
        })
      })
    );

    completedSeries.columns.template.setAll({
      fill: am5.color(0x4caf50),
      strokeOpacity: 0
    });

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout
      })
    );

    legend.data.setAll(chart.series.values);

    // Set data
    totalSeries.data.setAll(data);
    completedSeries.data.setAll(data);

    // Animate chart
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="workerEfficiencyChart" className="w-full h-full" />;
}
