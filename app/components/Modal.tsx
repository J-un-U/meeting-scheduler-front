import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import type { ReactNode } from "react"

type ModalSize = "sm" | "md" | "lg"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
}

export default function Modal({
                                isOpen,
                                onClose,
                                title,
                                children,
                                footer,
                                size = "md",
                              }: ModalProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={onClose}>
      <div className="fixed inset-0 bg-black/40" aria-hidden="true"/>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={`w-full ${SIZE_CLASS[size]} rounded-lg bg-white p-6 text-gray-900 shadow-xl duration-200 ease-out data-closed:translate-y-1 data-closed:opacity-0`}
          >
            <div className="flex items-start justify-between">
              {title ? (
                <DialogTitle as="h3" className="text-base font-semibold">
                  {title}
                </DialogTitle>
              ) : null}
              <button onClick={onClose}>X</button>
            </div>
            <div className="mt-3">{children}</div>
            {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
