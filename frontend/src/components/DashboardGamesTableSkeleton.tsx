import { Box, Flex, Skeleton, Stack } from "@chakra-ui/react";

const DashboardGamesTableSkeleton = () => {
  return (
    <Stack maxW={"85%"} mx={"auto"} my={"10"}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Flex
          key={index}
          alignItems={"center"}
          justifyContent={"space-between"}
          border={"1px solid var(--dark-700)"}
          h={"50px"}
          rounded={"md"}
          p={2}
        >
          <Skeleton h={"9px"} w={"120px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"120px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"120px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"120px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"120px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"120px"} bg={"var(--dark-800)"} />
          <Flex>
            <Skeleton h={"30px"} w={"50px"} bg={"red.400"} mr={4} />
            <Skeleton h={"30px"} w={"50px"} bg={"blue.400"} />
          </Flex>
        </Flex>
      ))}
      <Box>
        <Skeleton h={"15px"} w={"250px"} bg={"var(--dark-800)"} mx={"auto"} />
      </Box>
    </Stack>
  );
};

export default DashboardGamesTableSkeleton;
