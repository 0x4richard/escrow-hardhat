import { Button, Td, Tr } from "@chakra-ui/react";

export default function Escrow({
  account,
  depositor,
  arbiter,
  beneficiary,
  isApproved,
  value,
}) {
  const isAllowedToApprove = depositor === account;

  return (
    <Tr>
      <Td>{depositor}</Td>
      <Td>{arbiter}</Td>
      <Td>{beneficiary}</Td>
      <Td>{value} ETH</Td>
      <Td>
        {isApproved ? (
          "Approved"
        ) : (
          <Button disabled={!isAllowedToApprove}>Approve</Button>
        )}
      </Td>
    </Tr>
  );
}
