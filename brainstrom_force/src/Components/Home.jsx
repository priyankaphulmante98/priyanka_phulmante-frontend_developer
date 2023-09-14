import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  HStack,
  Image,
  Box,
  Input,
  GridItem,
  SimpleGrid,
  Button,
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
  const [totalpages, setTotalPages] = useState(1);
  const [openCapsuleModal, setOpenCapsuleModal] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState("");
  const [filterByType, setFilterByType] = useState("");
  const [filterByOriginal_launch, setFilterByOriginal_launch] = useState("");

  async function Getcapsule({
    page,
    filterByStatus,
    filterByType,
    filterByOriginal_launch,
  }) {
    try {
      const formattedDate = filterByOriginal_launch
        ? new Date(filterByOriginal_launch).toISOString().split("T")[0]
        : null;

      const response = await axios.get(
        `https://api.spacexdata.com/v3/capsules?status=${filterByStatus}&page=${page}&type=${filterByType}`
      );

      const newdata = formattedDate
        ? response.data.filter((e) => e.original_launch.includes(formattedDate))
        : response.data;

      setData(newdata);

      // console.log(response.data);
      setTotalPages(Math.ceil(response.headers["spacex-api-count"] / 10));

      setData(newdata.slice((page - 1) * 10, page * 10));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Clear the filter status type and original_launch
  function clearHandleFilter() {
    setFilterByStatus("");
    setFilterByType("");
    setFilterByOriginal_launch("");
  }

  // Convert a date format on YYYY-MM-DD function
  function formatDate(dateString) {
    if (!dateString) return "";
    const dateParts = dateString.split("T");
    const formattedDate = `${dateParts[0]}`;
    return formattedDate;
  }

  useEffect(() => {
    Getcapsule({
      page,
      filterByStatus,
      filterByType,
      filterByOriginal_launch,
    });
  }, [filterByOriginal_launch, filterByStatus, filterByType, page]);

  return (
    <Box as="center" className="main_data_box">
      <Box m={"2rem 0"} display={"flex"} justifyContent={"space-evenly"}>
        <HStack spacing={3}>
          {/* filter by status  */}

          <Select
            variant="outline"
            onChange={(e) => setFilterByStatus(e.target.value)}
            value={filterByStatus}
          >
            <option value="">Filter By Status</option>
            <option value="active">Active</option>
            <option value="retired">Retired</option>
            <option value="destroyed">Destroyed</option>
            <option value="unknown">Unknown</option>
          </Select>

          {/* filter by type  */}
          <Select
            variant="outline"
            onChange={(e) => setFilterByType(e.target.value)}
            value={filterByType}
          >
            <option value="">Filter By type</option>
            <option value="Dragon 1.0">Dragon 1.0</option>
            <option value="Dragon 1.1">Dragon 1.1</option>
            <option value="Dragon 2.0">Dragon 2.0</option>
          </Select>

          {/* filter by original launch  */}
          <Input
            variant="outline"
            type="date"
            onChange={(e) => setFilterByOriginal_launch(e.target.value)}
            value={filterByOriginal_launch}
          />

          {/* Clear Filter button */}

          <Button
            w={"300px"}
            backgroundColor="#2B6CB0"
            color="white"
            marginRight="3rem"
            onClick={clearHandleFilter}
          >
            Clear Filter
          </Button>
        </HStack>
      </Box>

      {/* start a data container */}

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
                    "https://cdn.dribbble.com/users/5649296/screenshots/13917713/media/62ac5cdf298da045656ef31a235981c8.gif"
                  }
                />

                <table style={{ width: "60%", marginLeft: "50px" }}>
                  <tbody>
                    <tr>
                      <th style={{ fontSize: "16px" }} className="bold-blue">
                        Type:
                      </th>
                      <td style={{ fontSize: "16px" }}>{e.type}</td>
                    </tr>
                    <tr>
                      <th style={{ fontSize: "16px" }} className="bold-blue">
                        Status:
                      </th>
                      <td style={{ fontSize: "16px" }}>{e.status}</td>
                    </tr>
                    {e.original_launch ? (
                      <>
                        <tr>
                          <th
                            style={{ fontSize: "16px" }}
                            className="bold-blue"
                          >
                            Launch Date:
                          </th>
                          <td style={{ fontSize: "16px" }}>
                            {formatDate(e.original_launch)}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <th
                            style={{ fontSize: "16px" }}
                            className="bold-blue"
                          >
                            Capsule ID:
                          </th>
                          <td style={{ fontSize: "16px" }}>{e.capsule_id}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

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
                {openCapsuleModal === e.capsule_id && (
                  <Modal capsule_id={e.capsule_id} isOpen={true} />
                )}
              </GridItem>
            </Link>
          );
        })}
      </SimpleGrid>

      {/* pagination starts here */}

      <Box marginTop={"30px"}>
        <Pagination totalpages={totalpages} page={page} setPage={setPage} />
      </Box>

      {/* Modal Starts here  */}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="17%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader backgroundColor="#2B6CB0" color="white">
            Capsule Details
          </ModalHeader>
          <ModalCloseButton color={"white"} marginTop={"10px"} />
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
                  {selectedCapsule.missions?.map((mission, index) => (
                    <>
                      <tr key={index}>
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
