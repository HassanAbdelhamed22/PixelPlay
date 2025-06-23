import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box textAlign="center" py={10} px={6} justifyContent={"center"}>
      <Heading
        display="inline-block"
        size="4xl"
        backgroundClip="text"
        fontWeight="bold"
        className="gaming-title"
      >
        404
      </Heading>
      <Text fontSize="20px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6} fontSize="18px">
        The page you&apos;re looking for does not seem to exist
      </Text>

      <Link to="/">
        <Button
          colorScheme="teal"
          className="gaming-btn-primary"
          color="white"
          variant="solid"
          size="lg"
        >
          Go to Home
        </Button>
      </Link>
    </Box>
  );
}
