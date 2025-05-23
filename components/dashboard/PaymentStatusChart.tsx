"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface PaymentStatusChartProps {
  data: {
    client: {
      status: string;
      amount: number;
    }[];
    worker: {
      status: string;
      amount: number;
    }[];
  };
}

export default function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new("paymentStatusChart");

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
        categoryField: "status",
        renderer: am5xy.AxisRendererY.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    yAxis.data.setAll([...data.client].map(d => ({ status: d.status })));

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        calculateTotals: true,
        min: 0
      })
    );

    // Create series for client payments
    const clientSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Client Payments",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "amount",
        categoryYField: "status",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Client: ${valueX}"
        })
      })
    );

    clientSeries.columns.template.setAll({
      fill: am5.color(0x2196f3),
      strokeOpacity: 0
    });

    // Create series for worker payments
    const workerSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Worker Payments",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "amount",
        categoryYField: "status",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Worker: ${valueX}"
        })
      })
    );

    workerSeries.columns.template.setAll({
      fill: am5.color(0x4caf50),
      strokeOpacity: 0
    });

    // Set data
    clientSeries.data.setAll(data.client);
    workerSeries.data.setAll(data.worker);

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout
      })
    );

    legend.data.setAll(chart.series.values);

    // Animate chart
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="paymentStatusChart" className="w-full h-full" />;
}
