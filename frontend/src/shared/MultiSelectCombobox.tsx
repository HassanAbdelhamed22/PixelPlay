"use client";

import {
  Badge,
  Combobox,
  Portal,
  Wrap,
  createListCollection,
  Box,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

interface ComboboxItem {
  value: string;
  label: string;
}

interface MultiSelectComboboxProps {
  items: string[];
  label: string;
  placeholder?: string;
  emptyMessage?: string;
  onSelectionChange?: (selectedItems: string[]) => void;
  defaultSelectedItems?: string[];
  width?: string;
}

const MultiSelectCombobox = ({
  items,
  label,
  placeholder = "Search...",
  emptyMessage = "No items found",
  onSelectionChange,
  defaultSelectedItems = [],
  width = "320px",
}: MultiSelectComboboxProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] =
    useState<string[]>(defaultSelectedItems);

  // Transform string items to ComboboxItem format and create collection
  const collection = useMemo(() => {
    const comboboxItems: ComboboxItem[] = items.map((item) => ({
      value: item,
      label: item,
    }));

    const filtered = comboboxItems.filter((item) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    console.log("Filtered Items:", filtered);

    return createListCollection({
      items: filtered.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    });
  }, [items, searchValue]);

  const handleValueChange = (details: Combobox.ValueChangeDetails) => {
    console.log("Selected Items:", details.value);
    setSelectedItems(details.value);
    onSelectionChange?.(details.value);
  };

  return (
    <Box width={width}>
      <Combobox.Root
        multiple
        closeOnSelect={false}
        value={selectedItems}
        collection={collection}
        onValueChange={handleValueChange}
        onInputValueChange={(details) => {
          console.log("Search Value:", details.inputValue);
          setSearchValue(details.inputValue);
        }}
      >
        <Combobox.Label>{label}</Combobox.Label>

        {/* Show selected items */}
        {selectedItems.length > 0 && (
          <Wrap gap="2" mb={2}>
            {selectedItems.map((item) => (
              <Badge key={item} colorScheme="blue">
                {item}
              </Badge>
            ))}
          </Wrap>
        )}

        <Combobox.Control>
          <Combobox.Input placeholder={placeholder} />
          <Combobox.IndicatorGroup>
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>

        <Portal>
          <Combobox.Positioner>
            <Combobox.Content
              maxH="200px"
              overflowY="auto"
              zIndex={9999}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="lg"
              _dark={{
                bg: "var(--dark-800)",
                borderColor: "gray.600",
              }}
            >
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel fontWeight="bold" p={2}>
                  {label}
                </Combobox.ItemGroupLabel>
                {collection.items.map((item) => (
                  <Combobox.Item
                    key={item.value}
                    item={item}
                    cursor="pointer"
                    _hover={{
                      bg: "gray.100",
                      _dark: { bg: "gray.700" },
                    }}
                  >
                    <Combobox.ItemText>{item.label}</Combobox.ItemText>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
                {collection.items.length === 0 && (
                  <Combobox.Empty p={2} color="gray.500">
                    {emptyMessage}
                  </Combobox.Empty>
                )}
              </Combobox.ItemGroup>
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Box>
  );
};

export default MultiSelectCombobox;
