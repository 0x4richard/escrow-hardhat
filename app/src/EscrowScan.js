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
import Escrow from "./Escrow";
import useContract from "./useContract";

function EscrowScan(account) {
  const [contractAddress, setContractAddress] = useState();
  const [escrow, setEscrow] = useState();
  const toast = useToast();
  const { provider, getContractByAddress } = useContract();

  const loadContract = async () => {
    if (!contractAddress) {
      toast({
        title: "Please input contract address",
        isClosable: true,
        status: "warning",
      });
      return;
    }

    const contract = getContractByAddress(contractAddress);

    const arbiterPromise = contract.arbiter();
    const beneficiaryPromise = contract.beneficiary();
    const depositorPromise = contract.depositor();
    const isApprovedPromise = contract.isApproved();
    const balancePromise = provider.getBalance(contract.address);
    const [arbiter, beneficiary, depositor, isApproved, balance] =
      await Promise.all([
        arbiterPromise,
        beneficiaryPromise,
        depositorPromise,
        isApprovedPromise,
        balancePromise,
      ]);

    const value = ethers.utils.formatEther(balance);

    setEscrow({
      address: contractAddress,
      account: account,
      arbiter,
      beneficiary,
      depositor,
      value,
      isApproved,
    });
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
