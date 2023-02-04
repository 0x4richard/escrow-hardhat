import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
// import Escrow from './Escrow';
import { Button, Input, HStack, Box, Heading, useToast } from '@chakra-ui/react'

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const toast = useToast();
  // const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [buttonText, setButtonText] = useState("Deploy Contract");
  const [isDeploying, setIsDeploying] = useState(false)

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function deployContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('ether').value);

    return deploy(signer, arbiter, beneficiary, value);
  }

  async function newContract() {
    setIsDeploying(true);
    setButtonText("Deploying...");

    // let escrowContract;
    try {
      await deployContract();
    } catch(ex) {
      console.log(ex);
      toast({title: "Failed to deploy the contract.", status: "error", isClosable: true});
    } finally {
      setIsDeploying(false);
      setButtonText("Deploy Contract")
    }


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

    // setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <HStack spacing={8}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading>New Contract</Heading>
          <label>
            Depositor
            <Input id="depositor" value={account} disabled/>
          </label>
          <label>
            Arbiter Address
            <Input id="arbiter" placeholder="arbiter"/>
          </label>

          <label>
            Beneficiary Address
            <Input id="beneficiary" placeholder="beneficiary"/>
          </label>

          <label>
            Deposit Amount (in Ether)
            <Input id="ether" placeholder='Deposit Amount (in ether)'/>
          </label>

          <Button id="deploy" mt={5} disabled={isDeploying} onClick={(e) => {
            e.preventDefault();
            newContract();
          } }>{buttonText}</Button>
        </Box>
        {/* <Box p={5} shadow="md" borderWidth="1px">
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
        </Box> */}
      </HStack>
    </>
  );
}

export default App;
