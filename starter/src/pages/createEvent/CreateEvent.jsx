import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  MenuList,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  MenuItem,
  Alert,
  Text,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

export const AddEventModal = ({
  event,
  categories,
  isOpen,
  onClose,
  eventVersion,
  setEventVersion,
}) => {
  // Form state variables
  const [createdBy, setCreatedBy] = useState(
    event === undefined ? null : event.createdBy
  );
  const [title, setTitle] = useState(event === undefined ? "" : event.title);
  const [description, setDescription] = useState(
    event === undefined ? "" : event.description
  );
  const [selectedCategories, setSelectedCategories] = useState(
    event === undefined
      ? []
      : categories.filter((cat) => event.categoryIds.includes(cat.id))
  );
  const [location, setLocation] = useState(
    event === undefined ? "" : event.location
  );
  const [startTime, setStartTime] = useState(
    event === undefined ? "" : event.startTime
  );
  const [endTime, setEndTime] = useState(
    event === undefined ? "" : event.endTime
  );

  // Function for selecting categories
  const handleCategoryChange = (cat) => {
    const selectedCategoryIds = selectedCategories.map((cat) => cat.id);
    if (selectedCategoryIds.includes(cat.id)) {
      const newArray = selectedCategories.filter((exCat) => exCat.id != cat.id);
      setSelectedCategories(newArray);
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Array with unselected categories
  const [remainingCategories, setRemainingCategories] = useState([]);
  useEffect(() => {
    if (categories) {
      const newArray = categories.filter(
        (cat) => !selectedCategories.map((sCat) => sCat.id).includes(cat.id)
      );
      setRemainingCategories(newArray);
    }
  }, [selectedCategories]);

  // States for handling creation
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Function for resetting the form
  const resetForm = () => {
    setHasError(false);
    setIsLoading(false);
    setCreatedBy(null);
    setTitle("");
    setDescription("");
    setSelectedCategories([]);
    setLocation("");
    setStartTime("");
    setEndTime("");
  };

  const createEvent = () => {
    // Create array of categoryIds
    const categoryIds = selectedCategories.map((cat) => cat.id);
    // Create event object
    const event = {
      createdBy,
      title,
      description,
      categoryIds,
      location,
      startTime,
      endTime,
    };
    return event;
  };

  // Update or create event
  const handleSubmit = async (eventId) => {
    setIsLoading(false);
    setHasError(false);
    event = createEvent();
    // Send request
    setIsLoading(true);
    let response;
    try {
      if (eventId === undefined) {
        response = await fetch("http://localhost:3000/events", {
          method: "POST",
          body: JSON.stringify(event),
          headers: { "Content-Type": "application/json;charset=utf-8" },
        });
      } else {
        response = await fetch(`http://localhost:3000/events/${eventId}`, {
          method: "PUT",
          body: JSON.stringify(event),
          headers: { "Content-Type": "application/json;charset=utf-8" },
        });
      }
    } catch (error) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    // Check response
    if (response.ok) {
      setIsLoading(false);
      setEventVersion(eventVersion + 1);
      resetForm();
      onClose();
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={["full", "md"]}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Event</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event"
            />

            <FormLabel>Category</FormLabel>
            <Menu>
              <MenuButton
                isDisabled={remainingCategories.length < 1}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {remainingCategories.length < 1
                  ? "No more categories"
                  : "Add Category"}
              </MenuButton>
              <MenuList>
                {remainingCategories.map((cat) => (
                  <MenuItem
                    textTransform={"capitalize"}
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Flex marginY={2}>
              {selectedCategories.map((cat) => (
                <Tag
                  textTransform={"capitalize"}
                  marginRight={2}
                  marginTop={2}
                  key={cat.id}
                >
                  <TagLabel>{cat.name}</TagLabel>
                  <TagCloseButton onClick={() => handleCategoryChange(cat)} />
                </Tag>
              ))}
            </Flex>

            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <FormLabel>Start time</FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <FormLabel>End time</FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              value={endTime}
              min={startTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>
          {hasError && (
            <Alert status="error" my={4}>
              <Box>
                <Text as="b">Something went wrong :(</Text>
                <Text>Check your input and try again later.</Text>
              </Box>
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup variant="outline" spacing="6">
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              onClick={() => handleSubmit(event.id)}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                if (event === undefined) {
                  resetForm();
                }
                onClose();
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
