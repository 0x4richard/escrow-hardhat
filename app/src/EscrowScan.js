import { useState } from "react";
import {
  useToast,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import EscrowContract from "./artifacts/contracts/Escrow.sol/Escrow";
import Escrow from "./Escrow";

function EscrowScan(account) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const escrow = {
  //   address: escrowContract.address,
  //   arbiter: "1",
  //   beneficiary: "1",
  //   value: "1.11",
  //   handleApprove: async () => {
  //     escrowContract.on('Approved', () => {
  //       document.getElementById(escrowContract.address).className =
  //         'complete';
  //       document.getElementById(escrowContract.address).innerText =
  //         "✓ It's been approved!";
  //     });

  //     await approve(escrowContract, signer);
  //   },
  // };
  const [contractAddress, setContractAddress] = useState();
  const [escrow, setEscrow] = useState();
  const toast = useToast();

  const loadContract = async () => {
    if (!contractAddress) {
      toast({
        title: "Please input contract address",
        isClosable: true,
        status: "warning",
      });
      return;
    }

    const contract = new ethers.Contract(
      contractAddress,
      EscrowContract.abi,
      provider
    );

    const arbiter = await contract.arbiter();
    const beneficiary = await contract.beneficiary();
    const depositor = await contract.depositor();
    const isApproved = await contract.isApproved();
    const balance = await provider.getBalance(contract.address);
    const value = ethers.utils.formatEther(balance);
    setEscrow({ account, arbiter, beneficiary, depositor, value, isApproved });
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading>Existing Contracts</Heading>
      <HStack mt={5}>
        <Box>
          <Input
            placeholder="contract address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </Box>
        <Box>
          <Button
            onClick={(e) => {
              e.preventDefault();
              loadContract();
            }}
          >
            Search
          </Button>
        </Box>
      </HStack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Depositor</Th>
              <Th>Arbiter</Th>
              <Th>Beneficiary</Th>
              <Th>Value</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>{escrow && <Escrow key={escrow.address} {...escrow} />}</Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default EscrowScan;
