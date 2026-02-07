import Modal from "./Modal";
import AddAccountForm from "../forms/AddAccountForm";
import type { Account } from "../../services/accounts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Account | null;
};

export const AddAccountModal = ({ isOpen, onClose, initialData }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2
      className="text-xl font-semibold mb-4"
      style={{ color: "var(--text-color)" }}
    >
      {initialData ? `Edit ${initialData.name}` : "Add New Account"}
    </h2>
    <AddAccountForm initialData={initialData} onClose={onClose} />
  </Modal>
);
