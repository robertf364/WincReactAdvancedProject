import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tooltip,
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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState(undefined);

  // Update the form to have the event's properties
  useEffect(() => {
    if (event) {
      setCreatedBy(event.createdBy)
      setTitle(event.title)
      setDescription(event.description)
      setSelectedCategories(categories.filter((cat) => event.categoryIds.includes(cat.id)))
      setLocation(event.location)
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setImage(event.image);
    }
  }, [event])

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
    if (image) {
      event.image = image
    }
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

  // Error statuses for fields
  const [isTouched, setTouchedFields] = useState({
    title: false,
    description: false,
    location: false,
    startTime: false,
    endTime: false,
  })
  const isError = {
    title: title === "",
    description: description === "",
    location: location === "",
    startTime: startTime === "",
    endTime: endTime === "",
  }
  const hasAnyError = Object.values(isError).some(Boolean)

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
    const tmpObj = {}
    for (const key of Object.keys(isTouched)) {
      tmpObj[key] = false
    }
    setTouchedFields(tmpObj)
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={["full", "md"]}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Event</ModalHeader>
        <ModalBody>
          <FormControl isInvalid={isError.title && isTouched.title}>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              onBlur={() => setTouchedFields({ ...isTouched, title: true })}
            />
            {(isTouched.title && isError.title) && (
              <FormErrorMessage>Title is required</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={isError.description && isTouched.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouchedFields({ ...isTouched, description: true })}
              placeholder="Describe your event"
            />
            {(isTouched.description && isError.description) && (
              <FormErrorMessage>Description is required</FormErrorMessage>
            )}
          </FormControl>

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

          <FormControl isInvalid={isError.location && isTouched.location}>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => setTouchedFields({ ...isTouched, location: true })}
            />
            {(isTouched.location && isError.location) && (
              <FormErrorMessage>Location is required</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={isError.startTime && isTouched.startTime}>
            <FormLabel>Start time</FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onBlur={() => setTouchedFields({ ...isTouched, startTime: true })}
            />
            {(isTouched.startTime && isError.startTime) && (
              <FormErrorMessage>Start time is required</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={isError.endTime && isTouched.endTime}>
            <FormLabel>End time</FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              value={endTime}
              min={startTime}
              onChange={(e) => setEndTime(e.target.value)}
              onBlur={() => setTouchedFields({ ...isTouched, endTime: true })}
            />
            {(isTouched.endTime && isError.endTime) && (
              <FormErrorMessage>End time is required</FormErrorMessage>
            )}
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
            <Tooltip label="Please fill out all fields" isDisabled={!hasAnyError}>
              <Button
                colorScheme="blue"
                isLoading={isLoading}
                isDisabled={hasAnyError}
                onClick={() => handleSubmit(event ? event.id : undefined)}
              >
                Save
              </Button>
            </Tooltip>
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
