"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface JobsPieChartProps {
  data: {
    type: string;
    count: number;
  }[];
}

export default function JobsPieChart({ data }: JobsPieChartProps) {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new("jobsPieChart");

    // Remove amcharts logo
    root._logo?.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    //Configure root container
    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        y: am5.percent(10),
      })
    );

    // Create chart
    const chart = container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(50),
        radius: am5.percent(80),
        layout: root.verticalLayout,
        y: am5.percent(50),
        centerY: am5.percent(50),
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "count",
        categoryField: "type",
        legendValueText: "{value}",
        legendLabelText: "{category}"
      })
    );

    // Modify label appearance
    series.labels.template.setAll({
      maxWidth: 120,
      oversizedBehavior: "wrap",
      fontSize: 12
    });

    // Set data
    series.data.setAll(data);

    // Add legend with modified settings
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(root, {
          fixedWidthGrid: true
        }),
        height: 100,
        marginTop: 25,
      })
    );

    // Configure legend labels
    legend.labels.template.setAll({
      fontSize: 12,
      maxWidth: 80
    });

    legend.data.setAll(series.dataItems);

    // Animate chart
    series.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="jobsPieChart" className="w-full h-full" />;
}
