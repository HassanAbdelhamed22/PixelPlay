import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  IconButton,
  Badge,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  DrawerBackdrop,
  DrawerPositioner,
  CloseButton,
  Container,
  Portal,
  Button,
  Menu,
} from "@chakra-ui/react";
import {
  GamepadIcon,
  ShoppingCartIcon,
  UserIcon,
  SearchIcon,
  MenuIcon,
  HomeIcon,
  TagIcon,
  HeadphonesIcon,
  LogOutIcon,
} from "lucide-react";
import { token } from "../constant";
import CookieService from "../services/CookieService";
import { useSelector } from "react-redux";
import { selectCart } from "../app/features/cartSlice";

const Navbar = () => {
  const { cartItems } = useSelector(selectCart);
  const { open, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const navigation = [
    { name: "Home", to: "/", icon: HomeIcon },
    { name: "Games", to: "/games", icon: GamepadIcon },
    { name: "Categories", to: "/categories", icon: TagIcon },
    // { name: "Deals", to: "/deals", icon: TrophyIcon },
    { name: "Support", to: "/support", icon: HeadphonesIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    CookieService.remove("jwt");
    window.location.reload();
  };

  return (
    <Box bg="var(--dark-950)" color="white">
      {/* Navigation */}
      <Box
        position="sticky"
        top={0}
        zIndex={50}
        borderBottom="1px solid"
        borderColor="var(--dark-800)"
        bg="var(--dark-950)"
        backdropFilter="blur(10px)"
      >
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <HStack gap={2}>
                <GamepadIcon size={32} color="#22d3ee" />
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  bgClip="text"
                  className="gaming-title gaming-font"
                >
                  PixelPlay
                </Text>
              </HStack>
            </Link>

            {/* Desktop Navigation */}
            <HStack gap={8} display={{ base: "none", md: "flex" }}>
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const isLinkActive = isActive(item.to);
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`nav-link ${isLinkActive ? "active" : ""}`}
                  >
                    <HStack gap={1}>
                      <IconComponent size={16} />
                      <Text>{item.name}</Text>
                    </HStack>
                  </Link>
                );
              })}
            </HStack>

            {/* Search and Actions */}
            <HStack gap={4} display={{ base: "none", md: "flex" }}>
              <InputGroup
                maxW="200px"
                startElement={<SearchIcon size={16} color="gray" />}
              >
                <Input
                  placeholder="Search games..."
                  bg="var(--dark-800)"
                  border="1px solid"
                  borderColor="var(--dark-700)"
                  _focus={{
                    borderColor: "var(--primary-400)",
                    boxShadow: "0 0 0 1px var(--chakra-colors-primary-400)",
                  }}
                  size="sm"
                />
              </InputGroup>
              {token ? (
                <>
                  <Box position="relative">
                    <Link to="/cart">
                      <IconButton
                        aria-label="Cart"
                        variant="ghost"
                        color="gray.300"
                        _hover={{ color: "var(--primary-400)" }}
                      >
                        <ShoppingCartIcon size={20} />
                      </IconButton>
                    </Link>
                    {cartItems.length > 0 && (
                      <Badge
                        position="absolute"
                        top="-1"
                        right="-1"
                        bg="var(--secondary-500)"
                        color="white"
                        borderRadius="full"
                        fontSize="xs"
                        minW="20px"
                        h="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {cartItems.length}
                      </Badge>
                    )}
                  </Box>
                  <Menu.Root>
                    <Menu.Trigger
                      asChild
                      className={`nav-link-icon ${
                        isActive("/profile") ? "active" : ""
                      }`}
                    >
                      <HStack cursor={"pointer"}>
                        <UserIcon size={20} />
                      </HStack>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content bg={"var(--dark-950)"}>
                          <Link to="/profile">
                            <Menu.Item value="profile" cursor={"pointer"}>
                              <UserIcon size={15} />
                              Profile
                            </Menu.Item>
                          </Link>
                          <Menu.Item
                            value="logout"
                            color="fg.error"
                            _hover={{ bg: "bg.error", color: "fg.error" }}
                            cursor={"pointer"}
                            onClick={handleLogout}
                          >
                            <LogOutIcon size={15} />
                            Logout
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </>
              ) : (
                <Box display="flex" gap={2}>
                  <Link to="/login">
                    <Button
                      colorScheme="teal"
                      className="gaming-btn-primary"
                      color="white"
                      variant="solid"
                      size="sm"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      colorScheme="teal"
                      color="white"
                      variant="outline"
                      borderColor="var(--primary-900)"
                      borderWidth="2px"
                      _hover={{
                        bg: "var(--primary-600)",
                        color: "white",
                        borderColor: "var(--primary-600)",
                        scale: 1.05,
                        boxShadow: "0 8px 25px rgba(34, 211, 238, 0.5)",
                        transform: "translateY(-2px)",
                      }}
                      transition={"all 0.3s"}
                      size="sm"
                    >
                      Register
                    </Button>
                  </Link>
                </Box>
              )}
            </HStack>

            {/* Mobile menu button */}
            <IconButton
              aria-label="Menu"
              variant="ghost"
              color="gray.300"
              _hover={{ color: "var(--primary-400)" }}
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
            >
              <MenuIcon size={20} />
            </IconButton>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer.Root
        open={open}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        placement="end"
      >
        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent bg="var(--dark-900)">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </DrawerHeader>
              <DrawerBody>
                <VStack gap={4} align="stretch">
                  {navigation.map((item) => {
                    const IconComponent = item.icon;
                    const isLinkActive = isActive(item.to);
                    return (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={`nav-link ${isLinkActive ? "active" : ""}`}
                        onClick={onClose}
                      >
                        <HStack gap={2}>
                          <IconComponent size={20} />
                          <Text>{item.name}</Text>
                        </HStack>
                      </Link>
                    );
                  })}
                  <InputGroup
                    startElement={<SearchIcon size={16} color="gray" />}
                    maxW="100%"
                  >
                    <Input
                      pointerEvents="auto"
                      placeholder="Search games..."
                      bg="var(--dark-800)"
                      border="1px solid"
                      borderColor="var(--dark-700)"
                    />
                  </InputGroup>
                  {token ? (
                    <Box display="flex" flexDir="column" gap={2}>
                      <HStack gap={4}>
                        <Link
                          to="/cart"
                          onClick={onClose}
                          className={`nav-link-icon ${
                            isActive("/cart") ? "active" : ""
                          }`}
                        >
                          <HStack>
                            <ShoppingCartIcon size={20} />
                            <Text>Cart (3)</Text>
                          </HStack>
                        </Link>
                        <Button
                          onClick={() => {
                            onClose();
                            handleLogout();
                          }}
                          className={`nav-link-icon ${
                            isActive("/profile") ? "active" : ""
                          }`}
                        >
                          <HStack>
                            <UserIcon size={20} />
                            <Text>Profile</Text>
                          </HStack>
                        </Button>
                      </HStack>
                      <HStack
                        color="fg.error"
                        _hover={{ bg: "bg.error", color: "fg.error" }}
                        cursor={"pointer"}
                        p={2}
                      >
                        <LogOutIcon size={20} />
                        <Text>Logout</Text>
                      </HStack>
                    </Box>
                  ) : (
                    <Box display="flex" gap={2}>
                      <Link to="/login">
                        <Button
                          colorScheme="teal"
                          className="gaming-btn-primary"
                          color="white"
                          variant="solid"
                          size="sm"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button
                          colorScheme="teal"
                          color="white"
                          variant="outline"
                          borderColor="var(--primary-900)"
                          borderWidth="2px"
                          _hover={{
                            bg: "var(--primary-600)",
                            color: "white",
                            borderColor: "var(--primary-600)",
                            scale: 1.05,
                            boxShadow: "0 8px 25px rgba(34, 211, 238, 0.5)",
                            transform: "translateY(-2px)",
                          }}
                          transition={"all 0.3s"}
                          size="sm"
                        >
                          Register
                        </Button>
                      </Link>
                    </Box>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default Navbar;
