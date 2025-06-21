import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { ShoppingCartIcon, StarIcon } from "lucide-react";

type Size = "small" | "medium" | "large";

interface GameCartProps {
  size?: Size;
}

const GameCart = ({ size = "medium" }: GameCartProps) => {
  const heights: Record<Size, string> = {
    small: "128px",
    medium: "192px",
    large: "256px",
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        size={16}
        color={i < Math.floor(rating) ? "#fbbf24" : "#64748b"}
        fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
      />
    ));
  };

  return (
    <Card.Root
      maxW="sm"
      overflow="hidden"
      margin={4}
      cursor="pointer"
      borderRadius="xl"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
      }}
      transition="all 0.3s"
    >
      <Box position="relative">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          h={heights[size]}
          w="100%"
          objectFit="cover"
          _hover={{ transform: "scale(1.1)" }}
          transition="transform 0.3s"
        />
        <Badge
          position="absolute"
          top={2}
          left={2}
          bgGradient="linear(to-r, secondary.500, accent.500)"
          color="white"
          px={2}
          py={1}
          borderRadius="lg"
          fontSize="sm"
          fontWeight="bold"
        >
          -20%
        </Badge>
        <Badge
          position="absolute"
          top={2}
          right={2}
          bg="blackAlpha.800"
          color="white"
          px={2}
          py={1}
          borderRadius="lg"
          fontSize="xs"
          backdropFilter="blur(4px)"
        >
          Free Shipping
        </Badge>
      </Box>
      <Card.Body gap="2">
        <Card.Title color={"primary.600"}>Living room Sofa</Card.Title>
        <HStack mb={3} gap={1}>
          {renderStars(4.5)}
          <Text color="gray.400" fontSize="sm" ml={2}>
            (4.5)
          </Text>
        </HStack>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack gap={2}>
            <Text fontSize="xl" fontWeight="bold" color="primary.400">
              $299.99
            </Text>
            <Text color="gray.400" textDecoration="line-through" fontSize="sm">
              $399.99
            </Text>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            _hover={{ transform: "scale(1.05)" }}
          >
            <ShoppingCartIcon size={16} style={{ marginRight: 8 }} />
            Add
          </Button>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default GameCart;
