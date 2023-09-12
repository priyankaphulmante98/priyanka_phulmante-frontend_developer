import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  HStack,
  Image,
  Text,
  Box,
  GridItem,
  SimpleGrid,
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";

function Home() {
  const [data, setData] = useState([]);
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("original_launch");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("asc");
  const [totalpages, setTotalPages] = useState(4);
  const [openCapsuleModal, setOpenCapsuleModal] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(null);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );

  async function Getcapsule({ limit, filterBy, sortBy, order, page }) {
    try {
      const response = await axios.get(
        `https://api.spacexdata.com/v3/capsules?limit=${limit}&filter=${filterBy}&sort=${sortBy}&order=${order}&page=${page}`
      );

      setData(response.data);
      console.log(response.data);
      setTotalPages(Math.ceil(response.headers["spacex-api-count"] / limit));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  //filter function
  const handleFilter = () => {
    Getcapsule({ limit, filterBy, sortBy, order, page });
  };

  useEffect(() => {
    Getcapsule({ limit, filterBy, sortBy, order, page });
  }, [limit, filterBy, sortBy, order, page]);

  return (
    <Box as="center" className="main_data_box">
      <Box m={"2rem 0"} display={"flex"} justifyContent={"space-evenly"}>
        <HStack spacing={3}>
          <Input
            variant="outline"
            placeholder="Type anything"
            onChange={(e) => setLimit(e.target.value)}
          />
          <Button
            backgroundColor="#2B6CB0"
            color="white"
            marginRight="3rem"
            onClick={handleFilter}
          >
            Apply
          </Button>

          <Select
            w={"400px"}
            variant="unstyled"
            placeholder="Limit"
            onChange={(e) => setLimit(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </Select>
        </HStack>
      </Box>

      <SimpleGrid
        columns={{ lg: 4, md: 2, sm: 1, base: 1 }}
        justifyContent={"Center"}
        alignItems={"center"}
        gap={6}
      >
        {data.map((e, index) => {
          return (
            <Link to={`/capsule/${e.capsule_id}`} key={index}>
              <GridItem className="capuslu_div" w="auto" h="auto" p={"1rem"}>
                <Image
                  src={
                    "https://media.istockphoto.com/id/935294048/vector/the-pill.jpg?s=612x612&w=0&k=20&c=bhhQ6-fT-X1JIMiFPXT5Ogn97fTnpDgcJsvWxAdNDKI="
                  }
                />
                <Text>Capsule id:{e.capsule_id}</Text>
                <Text>Type: {e.type}</Text>
                <Text>Status: {e.status}</Text>
                <Button
                  className="modal_btn"
                  onClick={() => {
                    setSelectedCapsule(e);
                    onOpen();
                  }}
                  backgroundColor="#2B6CB0"
                  color="white"
                >
                  Details
                </Button>
                {openCapsuleModal === index && (
                  <Modal capsule_id={e.capsule_id} isOpen={true} />
                )}
              </GridItem>
            </Link>
          );
        })}
      </SimpleGrid>

      <Box>
        <Pagination totalpages={totalpages} page={page} setPage={setPage} />
      </Box>

      {/* Modal Starts here  */}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader backgroundColor="#2B6CB0" color="white">
            Capsule Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCapsule && (
              <>
                <Text>Capsule id: {selectedCapsule.capsule_id}</Text>
                <Text>Type: {selectedCapsule.type}</Text>
                <Text>Status: {selectedCapsule.status}</Text>
                <Text>Details: {selectedCapsule.details}</Text>
                <Text>Capsule serial: {selectedCapsule.capsule_serial}</Text>
                <Text>Missions:</Text>
                {selectedCapsule.missions?.map((mission, missionIndex) => (
                  <div key={missionIndex}>
                    <Text>Mission Name: {mission?.name}</Text>
                    <Text>Mission Flight: {mission?.flight}</Text>
                  </div>
                ))}
                <Text>
                  Original launch unix: {selectedCapsule?.original_launch_unix}
                </Text>
                <Text>Original launch: {selectedCapsule?.original_launch}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button backgroundColor="#2B6CB0" color="white" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Home;
