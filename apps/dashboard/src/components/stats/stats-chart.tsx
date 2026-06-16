import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@xbrk/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

type MonthlyData = { month: string; count: number }[];

const TICK_MARGIN_DEFAULT = 8;
const JS_MONTH_INDEX_BASE = 1; // convert human month to JS month index

interface StatsChartProps {
  chartColor: string;
  data: MonthlyData;
  description: string;
  label: string;
  title: string;
}

export function StatsChart({ title, description, data, chartColor, label }: StatsChartProps) {
  const chartData = (data ?? []) as MonthlyData;

  const chartConfig = {
    count: {
      label,
      color: chartColor,
    },
  } satisfies ChartConfig;

  const formatMonthKeyToShort = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(Date.UTC(Number(year), Number(month) - JS_MONTH_INDEX_BASE, 1));
    return date.toLocaleString(undefined, { month: 'short' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id={`fill${label}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value: string) => formatMonthKeyToShort(value)}
              tickLine={false}
              tickMargin={TICK_MARGIN_DEFAULT}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="count"
              fill={`url(#fill${label})`}
              fillOpacity={0.4}
              stroke="var(--color-count)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
