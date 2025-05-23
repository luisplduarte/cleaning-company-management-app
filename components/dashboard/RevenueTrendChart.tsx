"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface RevenueTrendChartProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export default function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new("revenueTrendChart");

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
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // Create series
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Revenue",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "amount",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Revenue: ${valueY}"
        })
      })
    );

    // Add scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    // Set data
    const processedData = data.map(item => ({
      date: new Date(item.date).getTime(),
      amount: item.amount
    }));

    series.data.setAll(processedData);

    // Make series appear on chart
    series.appear(1000);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="revenueTrendChart" className="w-full h-full" />;
}
