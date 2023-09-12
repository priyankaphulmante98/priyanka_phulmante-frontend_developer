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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalpages, setTotalPages] = useState(4);
  const [openCapsuleModal, setOpenCapsuleModal] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  async function Getcapsule({ limit, filterStatus, filterType, order, page }) {
    try {
      const response = await axios.get(
        `https://api.spacexdata.com/v3/capsules?limit=${limit}&status=${filterStatus}&page=${page}`
      );

      setData(response.data);
      console.log(response.data);
      setTotalPages(Math.ceil(response.headers["spacex-api-count"] / limit));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const dateParts = dateString.split("T");
    const formattedDate = `${dateParts[0]}`;

    return formattedDate;
  }

  //filter function
  const handleFilter = () => {
    Getcapsule({ limit, filterStatus, page });
  };

  useEffect(() => {
    Getcapsule({ limit, filterStatus, page });
  }, [limit, filterStatus, page]);

  return (
    <Box as="center" className="main_data_box">
      <Box m={"2rem 0"} display={"flex"} justifyContent={"space-evenly"}>
        <HStack spacing={3}>
          <Input
            type="text"
            variant="outline"
            placeholder="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
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
          <Button
            backgroundColor="#2B6CB0"
            color="white"
            marginRight="3rem"
            onClick={handleFilter}
          >
            Clear Filter
          </Button>
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
                <Text className="blue-text">
                  <strong className="bold-blue">Capsule id:</strong>{" "}
                  {e.capsule_id}
                </Text>
                <Text className="blue-text">
                  {" "}
                  <strong className="bold-blue">Type:</strong> {e.type}
                </Text>
                <Text className="blue-text">
                  {" "}
                  <strong className="bold-blue">Status:</strong> {e.status}
                </Text>

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
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th>Details:</th>
                    <td>{selectedCapsule.details}</td>
                  </tr>
                  <tr>
                    <th>Capsule id:</th>
                    <td>{selectedCapsule.capsule_id}</td>
                  </tr>
                  <tr>
                    <th>Type:</th>
                    <td>{selectedCapsule.type}</td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>{selectedCapsule.status}</td>
                  </tr>
                  <tr>
                    <th>Capsule serial:</th>
                    <td>{selectedCapsule.capsule_serial}</td>
                  </tr>
                  <tr>
                    <th>Missions:</th>
                    <td></td>
                  </tr>
                  {selectedCapsule.missions?.map((mission, missionIndex) => (
                    <>
                      <tr key={missionIndex}>
                        <th>Mission Name:</th>
                        <td>{mission?.name}</td>
                      </tr>
                      <tr>
                        <th>Original Launch Date:</th>
                        <td>{formatDate(mission?.original_launch)}</td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <th>Original launch unix:</th>
                    <td>{selectedCapsule?.original_launch_unix}</td>
                  </tr>
                  <tr>
                    <th>Original launch:</th>
                    <td>{formatDate(selectedCapsule?.original_launch)}</td>
                  </tr>
                </tbody>
              </table>
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
