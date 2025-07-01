"use client";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  Portal,
  InputGroup,
  Input,
} from "@chakra-ui/react";
import type { FlexProps, BoxProps } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import type { IconType } from "react-icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import CookieService from "../../services/CookieService";
import {
  ChevronDownIcon,
  GamepadIcon,
  HeadphonesIcon,
  HomeIcon,
  LogOutIcon,
  SearchIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import { toaster } from "../../components/ui/toaster";

interface LinkItemProps {
  name: string;
  icon: IconType;
  to: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", to: "/dashboard", icon: HomeIcon },
  { name: "Games", to: "/dashboard/games", icon: GamepadIcon },
  { name: "Categories", to: "/dashboard/categories", icon: TagIcon },
  // { name: "Deals", to: "/deals", icon: TrophyIcon },
  { name: "Support", to: "/dashboard/support", icon: HeadphonesIcon },
];

const SidebarWithHeader = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    CookieService.remove("jwt");
    navigate("/login", { replace: true });
    toaster.create({
      title: "Logged out successfully",
      type: "success",
      duration: 3000,
      closable: true,
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box minH="100vh" bg={"gray.900"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        isActive={isActive}
        handleLogout={handleLogout}
      />
      <Drawer.Root
        open={open}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            isActive={isActive}
            handleLogout={handleLogout}
          />
        </DrawerContent>
      </Drawer.Root>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" bg={"var(--dark-950)"} minH="100vh">
        <Outlet />
      </Box>
    </Box>
  );
};

const SidebarContent = ({
  onClose,
  isActive,
  handleLogout,
  ...rest
}: SidebarProps & {
  isActive: (path: string) => boolean;
  handleLogout: () => void;
}) => {
  return (
    <Box
      transition="3s ease"
      bg={"var(--dark-950)"}
      borderRightWidth="1px"
      borderRightColor={"var(--dark-800)"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
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
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <Link to={link.to} key={link.name} style={{ textDecoration: "none" }}>
          <NavItem
            icon={link.icon}
            bg={isActive(link.to) ? "var(--primary-500)" : undefined}
            color={isActive(link.to) ? "white" : undefined}
          >
            <Text>{link.name}</Text>
          </NavItem>
        </Link>
      ))}
      {/* Logout button at the end */}
      <Box position="absolute" bottom="0" w="full" pb={4}>
        <NavItem
          icon={LogOutIcon}
          onClick={handleLogout}
          _hover={{ bg: "red.500", color: "white" }}
          transition={"background-color 0.2s, color 0.2s"}
        >
          Logout
        </NavItem>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      fontSize={"12"}
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "var(--primary-500)",
        color: "white",
      }}
      transition="background-color 0.2s, color 0.2s"
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const navigate = useNavigate();

  function handleLogout(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    event.preventDefault();
    CookieService.remove("jwt");
    navigate("/login", { replace: true });
    toaster.create({
      title: "Logged out successfully",
      type: "success",
      duration: 3000,
      closable: true,
    });
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 12 }}
      height="20"
      alignItems="center"
      bg={"var(--dark-950)"}
      borderBottomWidth="1px"
      borderBottomColor={"var(--dark-800)"}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>

      <Box display={"flex"} alignItems="center" gap={4}>
        <HStack gap={2}>
          <InputGroup
            maxW="200px"
            startElement={<SearchIcon size={16} color="gray" />}
          >
            <Input
              placeholder="Search ..."
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
        </HStack>

        <HStack gap={{ base: "0", md: "6" }}>
          <Flex alignItems={"center"}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <HStack
                  cursor={"pointer"}
                  display={"flex"}
                  gap={1}
                  alignItems={"flex-end"}
                >
                  <UserIcon size={20} />
                  <ChevronDownIcon size={12} />
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
          </Flex>
        </HStack>
      </Box>
    </Flex>
  );
};

export default SidebarWithHeader;
