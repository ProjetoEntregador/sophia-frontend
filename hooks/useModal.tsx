"use client";

import { Modal, ModalProps } from "@/components/Modal";
import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
    Modal: (props: Omit<ModalProps, "isOpen">) => {
      const { children, ...rest } = props;
      return (
        <Modal isOpen={isOpen} {...rest}>
          {children}
        </Modal>
      );
    },
  };
}
