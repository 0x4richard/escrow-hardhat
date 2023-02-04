import { Button, Td, Tr } from "@chakra-ui/react"

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  return (
    <Tr>
      <Td>{arbiter}</Td>
      <Td>{beneficiary}</Td>
      <Td>{value}</Td>
      <Td>
        <Button id={address} onClick={(e) => {
            e.preventDefault();
            handleApprove()
          }}>Approve</Button>
      </Td>
    </Tr>
  );
}
