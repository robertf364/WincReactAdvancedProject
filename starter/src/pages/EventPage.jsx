import { UserCard } from "../components/UserCard";
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Heading,
  Flex,
  Stack,
  Button,
  useDisclosure,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { GoTrash } from "react-icons/go";
import { HiOutlinePencil } from "react-icons/hi";
import { useNavigate, useLoaderData } from "react-router-dom";
import placeholder from "../assets/placeholder.svg";
import { fetchCategories } from "../helpers/dataRetrieval";
import { AddEventModal } from "./createEvent/CreateEvent";
import { EventCategories } from "./EventCategories";
import { EventDate } from "./EventDate";
import { DeleteDialog } from "./DeleteAlert";

export const loader = async ({ params }) => {
  const response = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const event = await response.json();
  const categories = await fetchCategories();
  return { event, categories };
};

export const EventPage = () => {
  const navigate = useNavigate();

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get event data
  const initalData = useLoaderData();
  const [event, setEvent] = useState(initalData.event);
  const [categories, _] = useState(initalData.categories);

  // Reload data after changes were made
  const toast = useToast();
  const [eventVersion, setEventVersion] = useState(0);
  useEffect(() => {
    const loadEventData = async () => {
      const response = await fetch(`http://localhost:3000/events/${event.id}`);
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
    };
    if (eventVersion > 0) {
      loadEventData();
      toast({
        title: "Changes saved.",
        description: "Your changes were sucessfully saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [eventVersion]);

  // Fetch user data
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userId = event.createdBy;
    const fetchUserData = async () => {
      let fetchedUser;
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
          fetchedUser = await response.json();
        } else {
          fetchedUser = null;
        }
      } catch {
        fetchedUser = null;
      }
      setUser(fetchedUser);
    };
    fetchUserData();
  }, []);

  // Deleting events
  const {
    isOpen: alertIsOpen,
    onOpen: alertOnOpen,
    onClose: alertOnClose,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const deleteEvent = async () => {
    fetch(`http://localhost:3000/events/${event.id}`, {
      method: "DELETE",
    });
  };

  const performDelete = () => {
    deleteEvent();
    navigate("/");
  };

  return (
    <Flex
      mx={"auto"}
      maxW={["100%", "80%"]}
      direction={{ base: "column-reverse", md: "row" }}
      gap={[0, 6]}
    >
      <DeleteDialog
        title={"Delete Event"}
        isOpen={alertIsOpen}
        onClose={alertOnClose}
        cancelRef={cancelRef}
        confirmAction={performDelete}
      />
      <AddEventModal
        event={event}
        categories={categories}
        isOpen={isOpen}
        onClose={onClose}
        eventVersion={eventVersion}
        setEventVersion={setEventVersion}
      />
      <Stack padding={5} flex={1}>
        <Heading>{event.title}</Heading>
        <Text>{event.description}</Text>
        <Box>
          <EventDate event={event} />
        </Box>
        <Flex>
          <EventCategories event={event} categories={categories} />
        </Flex>
        <Spacer />
        {user && <UserCard user={user} />}
        <Flex>
          <Button
            leftIcon={<HiOutlinePencil />}
            marginRight={5}
            onClick={onOpen}
          >
            Edit event
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<GoTrash />}
            onClick={alertOnOpen}
          >
            Delete event
          </Button>
        </Flex>
      </Stack>
      <Image
        margin={[0, 5]}
        flex={1}
        objectFit="cover"
        width={"100%"}
        src={event.image ? event.image : placeholder}
        alt={event.title}
        maxW={{ base: "100%", md: "40%" }}
      ></Image>
    </Flex>
  );
};
