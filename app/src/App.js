import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import { Button, Input, Stack, Box, Heading, useToast } from "@chakra-ui/react";
import EscrowScan from "./EscrowScan";

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
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function deployContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(
      document.getElementById("ether").value
    );

    return deploy(signer, arbiter, beneficiary, value);
  }

  async function newContract() {
    setIsDeploying(true);
    setButtonText("Deploying...");

    // let escrowContract;
    try {
      await deployContract();
    } catch (ex) {
      console.log(ex);
      toast({
        title: "Failed to deploy the contract.",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsDeploying(false);
      setButtonText("Deploy Contract");
    }

    // setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <Stack spacing={8}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading>New Contract</Heading>
          <label>
            Depositor
            <Input id="depositor" value={account} disabled />
          </label>
          <label>
            Arbiter Address
            <Input id="arbiter" placeholder="arbiter" />
          </label>

          <label>
            Beneficiary Address
            <Input id="beneficiary" placeholder="beneficiary" />
          </label>

          <label>
            Deposit Amount (in Ether)
            <Input id="ether" placeholder="Deposit Amount (in ether)" />
          </label>

          <Button
            id="deploy"
            mt={5}
            disabled={isDeploying}
            onClick={(e) => {
              e.preventDefault();
              newContract();
            }}
          >
            {buttonText}
          </Button>
        </Box>
        <EscrowScan key={account} account={account} />
      </Stack>
    </>
  );
}

export default App;
