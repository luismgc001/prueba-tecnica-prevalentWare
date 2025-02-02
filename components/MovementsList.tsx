import { gql, useQuery } from "@apollo/client";
import LoadingSpinner from "./LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MovementsTable } from "./MovementsTable";

export const GET_MOVEMENTS = gql`
  query GetMovements($userId: ID) {
    movements(userId: $userId) {
      id
      concept
      amount
      date
      user {
        id
        name
      }
    }
  }
`;

export default function MovementsList({ role }) {
  const { data: userData } = useQuery(gql`
    query GetCurrentUser {
      currentUser {
        id
      }
    }
  `);

  const { data, loading, error } = useQuery(GET_MOVEMENTS, {
    variables: { userId: userData?.currentUser?.id },
  });

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    );

  return <MovementsTable data={data.movements} />;
}
