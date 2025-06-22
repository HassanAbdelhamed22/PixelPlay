import { Box, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";

const GamesSkeleton = () => {
  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      cursor="pointer"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
      }}
      transition="all 0.3s"
      className="gaming-card"
    >
      <Box position="relative">
        <Skeleton
          height="192px"
          width="100%"
          _hover={{ transform: "scale(1.1)" }}
          transition="transform 0.3s"
        />
        <Skeleton
          position="absolute"
          top={2}
          left={2}
          height="24px"
          width="60px"
          borderRadius="lg"
        />
        <Skeleton
          position="absolute"
          top={2}
          right={2}
          height="24px"
          width="80px"
          borderRadius="lg"
        />
      </Box>
      <Box p={4}>
        <SkeletonText noOfLines={1} mb={2} height="24px" width="70%" />
        <HStack mb={3} gap={1}>
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} height="16px" width="16px" borderRadius="full" />
          ))}
          <SkeletonText noOfLines={1} width="40px" height="16px" ml={2} />
        </HStack>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack gap={2}>
            <SkeletonText noOfLines={1} width="50px" height="24px" />
            <SkeletonText noOfLines={1} width="50px" height="20px" />
          </HStack>
          <Skeleton
            height="32px"
            width="60px"
            borderRadius="md"
            _hover={{ transform: "scale(1.05)" }}
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default GamesSkeleton;
