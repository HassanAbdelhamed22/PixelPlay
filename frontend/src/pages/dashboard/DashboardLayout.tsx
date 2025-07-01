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
} from "@chakra-ui/react";
import type { FlexProps, BoxProps } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import CookieService from "../../services/CookieService";
import {
  GamepadIcon,
  HeadphonesIcon,
  HomeIcon,
  LogOutIcon,
  TagIcon,
} from "lucide-react";

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

const handleLogout = () => {
  CookieService.remove("jwt");
  window.location.reload();
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
          <NavItem icon={link.icon}>
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
          fontSize="12"
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
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      // bg={"var(--dark-950)"}
      // borderBottomWidth="1px"
      // borderBottomColor={"var(--dark-800)"}
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
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={"gray.900"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer.Root
        open={open}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer.Root>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
