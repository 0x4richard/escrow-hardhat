import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import { Button, Input, HStack, Box, Heading, TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react'

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <HStack spacing={8}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading>New Contract</Heading>
          <label>
            Arbiter Address
            <Input id="arbiter" placeholder="arbiter"/>
          </label>

          <label>
            Beneficiary Address
            <Input id="beneficiary" placeholder="beneficiary"/>
          </label>

          <label>
            Deposit Amount (in Wei)
            <Input id="wei" placeholder='Deposit Amount (in Wei)'/>
          </label>

          <Button id="deploy" mt={5} onClick={(e) => {
            e.preventDefault();
            newContract();
          } } >Deploy Contract</Button>
        </Box>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading>Existing Contracts</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Arbviter</Th>
                  <Th>Beneficiary</Th>
                  <Th>Value</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {escrows.map((escrow) => {
                  return <Escrow key={escrow.address} {...escrow} />;
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </HStack>
    </>
  );
}

export default App;
