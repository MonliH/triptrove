import React from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Flex,
  Text,
  Heading,
  HStack,
  VStack,
  Box,
  Circle,
} from "@chakra-ui/react";
import Zoom from "react-reveal/Zoom";

interface BudgetBreakDownProps {}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div>
          {payload.map((pld: any) => (
            <div className="custom" key={pld.name}>
              <p>{pld.name}:</p>
              <div style={{ color: pld.fill }}>${pld.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const BudgetBreakDown: React.FC<BudgetBreakDownProps> = () => {
  const data = [
    { name: "Flight", value: 1600 },
    { name: "Hotel", value: 2000 },
    { name: "Itineraries", value: 500 },
  ];
  const RADIAN = Math.PI / 180;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Zoom>
    <Flex
      direction="column"
      bg="#ffffff"
      borderRadius="20px"
      shadow="base"
      p={10}
      mt={10}
      mb={2}
    >
      <Heading color="#54C4D6">Total Price: $3000</Heading>
      <HStack>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
        </PieChart>
        <Flex direction="column" align="center" justify="center">
          <VStack d="flex" align="center" justify="center">
            <HStack align="center" justify="center">
              <Circle size="40px" bg="#0088FE" color="white" />

              <Text>Flights</Text>
            </HStack>
            <HStack align="center" justify="center">
              <Circle size="40px" bg="#00C49F" color="white" />

              <Text>Hotels</Text>
            </HStack>

            <HStack align="center" justify="center">
              <Circle size="40px" bg="#FFBB28" color="white" />

              <Text>Events</Text>
            </HStack>
          </VStack>
        </Flex>
      </HStack>
    </Flex>
    </Zoom>
  );
};

export default BudgetBreakDown;
