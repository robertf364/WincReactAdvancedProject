import React from "react";
import {
  Button,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Wrap,
} from "@chakra-ui/react";
import { EventCard } from "./EventCard";
import { SearchIcon, CloseIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { fetchCategories, fetchEvents } from "../helpers/dataRetrieval";
import { AddEventModal } from "./createEvent/CreateEvent";
import placeholder from "../assets/placeholder.svg";

export const loader = async () => {
  // Fetch events
  const categories = await fetchCategories();
  return { categories };
};

export const EventsPage = () => {
  // All needed data
  const { categories } = useLoaderData();

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State and effect for reloading events
  const [eventVersion, setEventVersion] = useState(0);
  const [eventsError, setEventsError] = useState(false);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEventData = async () => {
      setEvents(await fetchEvents(setEventsError));
    };
    fetchEventData();
  }, [eventVersion]);

  // State for searching and filtering
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState([]);

  // Function for searching
  const searchEvents = (text, events) => {
    if (text === "") {
      return events;
    } else {
      const searchResult = events.filter(
        (e) =>
          e.title.toLowerCase().includes(text) ||
          e.description.toLowerCase().includes(text)
      );
      return searchResult;
    }
  };

  // Function for setting filter
  const handleCatFilter = (id) => {
    let result = catFilter.map((c) => c);
    if (catFilter.includes(id)) {
      result = result.filter((c) => c != id);
    } else {
      result = [...result, id];
    }
    setCatFilter(result);
  };

  // Function for filtering
  const filterEvents = (catIds, events) => {
    if (catIds.length < 1) {
      return events;
    } else {
      let result = events.map((e) => e);
      result = result.filter(
        (e) =>
          catIds.every((c) => e.categoryIds.includes(c)) &&
          e.categoryIds.length > 0
      );
      return result;
    }
  };

  // Actually filtering data
  const [filteredEvents, setFilteredEvents] = useState([]);
  useEffect(() => {
    let result = events.map((e) => e);
    result = searchEvents(search, result);
    result = filterEvents(catFilter, result);
    setFilteredEvents(result);
  }, [events, search, catFilter]);

  return (
    <Stack mx={"auto"} padding={5} spacing={5} maxW={["100%", "80%"]}>
      <HStack>
        <Heading>List of events</Heading>
        <Spacer />
        <Button onClick={onOpen}>Add Event</Button>
        <AddEventModal
          categories={categories}
          isOpen={isOpen}
          onClose={onClose}
          eventVersion={eventVersion}
          setEventVersion={setEventVersion}
        />
      </HStack>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          value={search}
          placeholder="Search.."
          onChange={(e) => setSearch(e.target.value)}
        />
        {search !== "" && (
          <InputRightElement>
            <Button onClick={() => setSearch("")}>
              <CloseIcon />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <Wrap>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            opacity={catFilter.includes(cat.id) ? 1.0 : 0.4}
            textTransform={"capitalize"}
            marginRight={2}
            onClick={() => handleCatFilter(cat.id)}
            leftIcon={catFilter.includes(cat.id) ? <CheckIcon /> : <AddIcon />}
            variant="solid"
          >
            {cat.name}
          </Button>
        ))}
        {catFilter.length > 0 && (
          <Button
            marginRight={2}
            onClick={() => setCatFilter([])}
            leftIcon={<CloseIcon />}
            variant="outline"
          >
            Clear filters
          </Button>
        )}
      </Wrap>
      {eventsError && (
        <Text></Text>
      )}
      {filteredEvents.length < 1 && (
        <Text marginTop={5} as={"b"}>
          {eventsError ? (
            "No events could be loaded. Please check your internet connection and try again."
          ) : (
            "No results for these categories :("
          )}
        </Text>
      )}
      {filteredEvents.map((event) => (
        <Link key={event.id} to={`event/${event.id}`}>
          <EventCard
            event={event}
            placeholder={placeholder}
            categories={categories}
          />
        </Link>
      ))}
    </Stack>
  );
};
