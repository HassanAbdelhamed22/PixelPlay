import { Text, VStack } from "@chakra-ui/react";
import DashboardGamesTable from "../../components/DashboardGamesTable";

const DashboardGames = () => {
  return (
    <div>
      <VStack align="start" gap={2} mb={8} mx={8}>
        <Text fontSize="4xl" fontWeight="bold">
          <Text as="span" className="gaming-title">
            Dashboard Games
          </Text>
        </Text>
        <Text color="gray.400">Manege your games</Text>
      </VStack>
      <DashboardGamesTable />
    </div>
  );
};

export default DashboardGames;
