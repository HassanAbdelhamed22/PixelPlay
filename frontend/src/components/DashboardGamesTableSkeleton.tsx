import { Flex, Skeleton, Stack } from "@chakra-ui/react";

const DashboardGamesTableSkeleton = () => {
  return (
    <Stack gap="10" maxW={"100%"} mx={8} my={"10"}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Flex
          key={index}
          alignItems={"center"}
          justifyContent={"space-between"}
          border={"1px solid var(--dark-700)"}
          h={"70px"}
          rounded={"md"}
          p={2}
        >
          <Skeleton h={"9px"} w={"20px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton
            h={"60px"}
            w={"60px"}
            bg={"var(--dark-800)"}
            rounded={"md"}
          />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Skeleton h={"9px"} w={"60px"} bg={"var(--dark-800)"} />
          <Flex>
            <Skeleton h={"30px"} w={"40px"} bg={"purple.300"} mr={4} />
            <Skeleton h={"30px"} w={"40px"} bg={"blue.300"} mr={4} />
            <Skeleton h={"30px"} w={"40px"} bg={"red.300"} />
          </Flex>
        </Flex>
      ))}
    </Stack>
  );
};

export default DashboardGamesTableSkeleton;
